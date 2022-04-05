import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class ReservationStack extends Stack {
  private api = new RestApi(this, "ReservationApi");

  private reservationTable = new GenericTable(this, {
    tableName: "ReservationTable",
    primaryKey: "reservationId",
    createLambdaPath: 'Create'
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const nodeLambda = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");

    nodeLambda.addToRolePolicy(s3ListPolicy);

    // Hello Api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(nodeLambda);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);

    // Reservation API integration
    const reservationResources = this.api.root.addResource('reservations');
    reservationResources.addMethod('POST', this.reservationTable.createLambdaIntegration);
  }
}
