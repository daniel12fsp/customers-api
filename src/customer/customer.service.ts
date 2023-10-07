import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectTypeDorm, TypeDormConnection } from '@nest-dynamodb/typedorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
  }

  async findAll() {
    const item = await this.connection.entityManager.find(Customer, {});
    return { item };
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
