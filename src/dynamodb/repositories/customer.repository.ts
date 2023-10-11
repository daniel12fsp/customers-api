import { BaseRepository } from './base.repository';
import { Customer } from '../../customer/entities/customer.entity';
import { DynamoDBRepository } from '../dynamodb.decorator';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

@DynamoDBRepository()
export class CustomerRepository extends BaseRepository<Customer> {
  protected tableName = 'customers';

  async searchAllFields(searchTerm) {
    const command = new ScanCommand({
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':searchTerm': searchTerm,
      },
      FilterExpression:
        'contains(#id, :searchTerm) OR contains(#name, :searchTerm) OR contains(#email, :searchTerm)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#name': 'name',
        '#email': 'email',
      },
      ConsistentRead: true,
    });

    const results = await this.docClient.send(command);
    return results.Items;
  }
}
