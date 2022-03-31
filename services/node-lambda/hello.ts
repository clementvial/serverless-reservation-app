import { v4 } from "uuid";

export async function handler(event: any, context:any) {
  return {
    statusCode: 200,
    body: `Hello from node lambda ${v4()}`
  }
}