#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { ProductsAppStack } from "../lib/productsApp-stack"
import { ECommerceApiStack } from "../lib/ecommerceApi-stack"
import { ProductsAppLayersStack } from "../lib/productsAppLayers-stack"
import { EventsDdbStack } from "lib/eventsDdb-stack"

const app = new cdk.App()

const env: cdk.Environment = {
  account: "126027520545",
  region: "sa-east-1"
}

const tags = {
  cost: "ECommerce",
  team: "ECommerceDev"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env
})

const eventsDdbStack = new EventsDdbStack(app, "EventsDdb", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env,
  eventsDdb: eventsDdbStack.table
})
productsAppStack.addDependency(productsAppLayersStack)
productsAppStack.addDependency(eventsDdbStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)
