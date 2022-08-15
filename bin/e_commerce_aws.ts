#!/usr/bin/env node
<<<<<<< HEAD
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ECommerceAwsStack } from "../lib/e_commerce_aws-stack";

const app = new cdk.App();
new ECommerceAwsStack(app, "ECommerceAwsStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
=======
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();
const env: cdk.Environment = {
  account: '777608088981',
  region: 'us-east-1',
};

const tags = {
  cost: 'ECommerce',
  team: 'SiecolaCode',
};

const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  tags: tags,
  env: env,
});

const eCommerceApiStack = new ECommerceApiStack(app, 'ECommerceApi', {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  tags: tags,
  env: env,
});
eCommerceApiStack.addDependency(productsAppStack);
>>>>>>> bd546e7 (build: first commit)
