import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { Product, ProductRepository } from "/opt/nodejs/productsLayer"
import { DynamoDB, Lambda } from "aws-sdk"
import * as AWSXRAY from "aws-xray-sdk"
import { ProductEvent, ProductEventType } from "/opt/nodejs/productEventsLayer"

AWSXRAY.captureAWS(require("aws-sdk"))
const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()
const lambdaClient = new Lambda()
const productEventsFunctionName = process.env.PRODUCT_EVENT_FUNCTION_NAME!
const productRepository = new ProductRepository(ddbClient, productsDdb)

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const lambdaRequestId = context.awsRequestId
  const apiRequestId = event.requestContext.requestId

  console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)

  if (event.resource === "/products") {
    console.log("POST /products")
    const product = JSON.parse(event.body!) as Product
    const productCreated = await productRepository.create(product)

    const response = await sendProductEvent(productCreated, ProductEventType.CREATED, "edu@edu.com", lambdaRequestId)

    console.log(`[Product Event Creation Response]: ${response}`)
    return {
      statusCode: 201,
      body: JSON.stringify(productCreated)
    }
  } else if (event.resource === "/products/{id}") {
    const productId = event.pathParameters!.id as string
    if (event.httpMethod === "PUT") {
      console.log(`PUT /products/${productId}`)
      const product = JSON.parse(event.body!) as Product

      try {
        const productUpdated = await productRepository.updateProduct(productId, product)
        const response = await sendProductEvent(
          productUpdated,
          ProductEventType.UPDATED,
          "dudu@edu.com",
          lambdaRequestId
        )

        console.log(`[Product Event Updating Response]: ${response}`)

        return {
          statusCode: 200,
          body: JSON.stringify(productUpdated)
        }
      } catch (ConditionalCheckFailedException) {
        return {
          statusCode: 404,
          body: "Product not found"
        }
      }
    } else if (event.httpMethod === "DELETE") {
      console.log(`DELETE /products/${productId}`)
      try {
        const product = await productRepository.deleteProduct(productId)
        const response = await sendProductEvent(product, ProductEventType.DELETED, "eduardo@edu.com", lambdaRequestId)

        console.log(`[Product Event Deleted Response]: ${response}`)

        return {
          statusCode: 200,
          body: JSON.stringify(product)
        }
      } catch (error) {
        console.error((<Error>error).message)
        return {
          statusCode: 404,
          body: (<Error>error).message
        }
      }
    }
  }

  return {
    statusCode: 400,
    body: "Bad request"
  }
}

function sendProductEvent(product: Product, eventType: ProductEventType, email: string, lambdaRequestId: string) {
  const event: ProductEvent = {
    email,
    eventType,
    productCode: product.code,
    productId: product.id,
    productPrice: product.price,
    requestId: lambdaRequestId
  }

  return lambdaClient
    .invoke({
      FunctionName: productEventsFunctionName,
      Payload: JSON.stringify(event),
      InvocationType: "RequestResponse"
    })
    .promise()
}
