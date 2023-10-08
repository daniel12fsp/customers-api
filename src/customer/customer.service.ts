import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomerRepository } from '../dynamodb/repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = new Customer();
    customer.id = uuidv4();
    customer.name = createCustomerDto.name;
    customer.email = createCustomerDto.email;
    return this.customerRepository.create(customer);
  }

  async searchAllFields(searchTerm: string) {
    return this.customerRepository.searchAllFields(searchTerm);
  }

  async findAll() {
    return this.customerRepository.findAll();
  }

  async findOne(id: string) {
    const item = await this.customerRepository.findOne(id);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    const customer = new Customer();
    customer.id = id;
    customer.name = updateCustomerDto.name;
    customer.email = updateCustomerDto.email;
    return this.customerRepository.update(customer);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.customerRepository.remove(id);

    return;
  }
}
