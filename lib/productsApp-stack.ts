<<<<<<< HEAD
import * as lambda from 'aws-cdk-lib/aws-lambda';
=======
>>>>>>> bd546e7 (build: first commit)
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ProductsAppStack extends cdk.Stack {
<<<<<<< HEAD
  readonly productsFatchHandler: lambdaNodeJS.NodejsFunction;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.productsFatchHandler = new lambdaNodeJS.NodejsFunction(
=======
  readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(
>>>>>>> bd546e7 (build: first commit)
      this,
      'ProductsFetchFunction',
      {
        functionName: 'ProductsFetchFunction',
        entry: 'lambda/products/productsFetchFunction.ts',
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
      },
    );
  }
}
