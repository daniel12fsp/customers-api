import { BaseRepository } from './base.repository';
import { Customer } from '../../customer/entities/customer.entity';
import { DynamoDBRepository } from '../dynamodb.decorator';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

@DynamoDBRepository()
export class CustomerRepository extends BaseRepository<Customer> {
  protected tableName = 'customers';
}
