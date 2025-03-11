import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  return DynamoDBDocumentClient.from(client);
};
