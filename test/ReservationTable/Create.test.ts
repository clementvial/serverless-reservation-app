import { handler } from "../../services/ReservationTable/Create";
import { APIGatewayProxyEvent } from 'aws-lambda';

const event = {  
  body: JSON.stringify({
    location: 'Paris'
  })
}

handler(event as any, {} as any);