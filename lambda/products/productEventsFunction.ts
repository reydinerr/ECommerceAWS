import { DynamoDB } from "aws-sdk"
import * as AWSXRAY from "aws-xray-sdk"
import { ProductEvent } from "/opt/nodejs/productEventsLayer"
import { Callback, Context } from "aws-lambda"

AWSXRAY.captureAWS(require("aws-sdk"))

const eventsDdb = process.env.EVENTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()

export async function handler(event: ProductEvent, context: Context, callback: Callback): Promise<void> {
  console.info(`//TODO to be removed ${event}`)
  console.info(`[LambdaRequestId]: ${context.awsRequestId}`)

  await createEvent(event)

  callback(null, JSON.stringify({
      productEventCreated: true,
      message: "OK"
    })
  )
}

function createEvent(event: ProductEvent) {
  const timestamp = Date.now()
  const ttl = ~~(timestamp / 1000 + 5 * 60)

  return ddbClient
    .put({
      TableName: eventsDdb,
      Item: {
        pk: `#product_${event.productCode}`,
        sk: `${event.eventType}#${timestamp}`,
        email: event.email,
        createdAt: timestamp,
        requestId: event.requestId,
        info: {
          productId: event.productId,
          price: event.productPrice
        },
        ttl
      }
    })
    .promise()
}
