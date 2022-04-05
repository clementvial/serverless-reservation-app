import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    body: '',
    statusCode: 200
  }

  const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  item.reservationId = v4();

  try {
    await dbClient.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();

    result.body = JSON.stringify(`Created item with id: ${item.reservationId}`);
  } catch (error) {
    result.body = error.message;
    result.statusCode = 500
  }

  return result;
}

export { handler };