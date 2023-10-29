import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as ssm from "aws-cdk-lib/aws-ssm"

export class ProductsAppLayersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const productsLayers = new lambda.LayerVersion(this, "ProductsLayer", {
      code: lambda.Code.fromAsset("lambda/products/layers/productsLayer"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      layerVersionName: "ProductsLayer",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
    new ssm.StringParameter(this, "ProductsLayerVersionArn", {
      parameterName: "ProductsLayerVersionArn",
      stringValue: productsLayers.layerVersionArn
    })

    const productEventsLayers = new lambda.LayerVersion(this, "ProductEventsLayer", {
      code: lambda.Code.fromAsset("lambda/products/layers/productEventsLayer"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      layerVersionName: "ProductEventsLayer",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
    new ssm.StringParameter(this, "ProductsEventsLayerVersionArn", {
      parameterName: "ProductsEventsLayerVersionArn",
      stringValue: productEventsLayers.layerVersionArn
    })
  }
}
