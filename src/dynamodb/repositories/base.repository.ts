import { InternalServerError } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T extends { id: string }> {
  protected abstract tableName: string;

  protected constructor(protected readonly docClient: DynamoDBDocumentClient) {}

  async create(item: T) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
      ReturnValues: 'ALL_OLD',
    });
    await this.docClient.send(command);
    return item;
  }

  async findAll() {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    const response = await this.docClient.send(command);

    return response.Items || [];
  }

  async findOne(id: string) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    const response = await this.docClient.send(command);
    return response.Item;
  }
  //https://dev.to/dvddpl/dynamodb-dynamic-method-to-insert-or-edit-an-item-5fnh
  async update(item: T) {
    const itemKeys = Object.keys(item).filter((k) => k !== 'id');
    const params = {
      TableName: this.tableName,
      UpdateExpression: `SET ${itemKeys
        .map((k, index) => `#field${index} = :value${index}`)
        .join(', ')}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`#field${index}`]: k,
        }),
        {},
      ),
      ExpressionAttributeValues: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`:value${index}`]: item[k],
        }),
        {},
      ),
      Key: {
        ['id']: item['id'],
      },
      ReturnValues: 'ALL_NEW',
    };
    try {
      await this.docClient.send(new UpdateCommand(params));
    } catch (error) {
      console.log(error);
      throw new InternalServerError(error);
    }
  }

  async remove(id: string) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    await this.docClient.send(command);
    return;
  }
}
