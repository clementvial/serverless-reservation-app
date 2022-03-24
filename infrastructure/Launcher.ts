import { ReservationStack } from "./ReservationStack";
import { App } from "aws-cdk-lib";

const app = new App();

const reservationStack = new ReservationStack(app, 'serverless-reservation-app', {
  stackName: 'serverless-reservation-app'
})