import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerRepository } from '../dynamodb/repositories/customer.repository';

import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('uuid');

const UNIQUE_UUID = 'testid';
uuidv4.mockImplementation(() => UNIQUE_UUID);

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: CustomerRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
    })
      .useMocker((token) => {
        if (token == CustomerRepository) {
          return {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          };
        }
      })
      .compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const payload = new Customer();
    payload.id = UNIQUE_UUID;
    payload.name = 'name';
    payload.email = 'email';

    //@ts-ignore
    repository.create.mockImplementation(() => Promise.resolve(payload));
    expect(await service.create(payload)).toEqual(payload);
  });

  it('should get all customers ', async () => {
    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([]));
    expect(await service.findAll()).toEqual([]);

    const item = {
      id: UNIQUE_UUID,
      email: 'email',
      name: 'name',
    };

    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([item]));
    expect(await service.findAll()).toEqual([item]);
  });

  it('should get all customers ', async () => {
    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([]));
    expect(await service.findAll()).toEqual([]);

    const item = {
      id: UNIQUE_UUID,
      email: 'email',
      name: 'name',
    };

    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([item]));
    expect(await service.findAll()).toEqual([item]);
  });

  it('should get all customers ', async () => {
    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([]));
    expect(await service.findAll()).toEqual([]);

    const item = {
      id: UNIQUE_UUID,
      email: 'email',
      name: 'name',
    };

    //@ts-ignore
    repository.findAll.mockImplementation(() => Promise.resolve([item]));
    expect(await service.findAll()).toEqual([item]);
  });

  describe('should update works', () => {
    it('when element exists', async () => {
      const item = {
        id: UNIQUE_UUID,
        email: 'email',
        name: 'name',
      };

      const novoItem: UpdateCustomerDto = {
        ...item,
        email: 'email',
      };

      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve(item));
      //@ts-ignore
      repository.update.mockImplementation((update) => Promise.resolve(update));

      expect(await service.update(item.id, novoItem)).toEqual(novoItem);
    });

    it('when element not exists must return error', async () => {
      const item = {
        id: UNIQUE_UUID,
        email: 'email',
        name: 'name',
      };

      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve());
      //@ts-ignore
      repository.update.mockImplementation(() => Promise.resolve());

      expect(service.update('no-exist', item)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('should findOne works', () => {
    it('when element exists must return this element', async () => {
      const item = {
        id: UNIQUE_UUID,
        email: 'email',
        name: 'name',
      };

      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve(item));
      expect(await service.findOne(UNIQUE_UUID)).toEqual(item);
    });

    it('when element not exists must return error', async () => {
      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve(undefined));
      expect(service.findOne(UNIQUE_UUID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('should remove works', () => {
    it('when element exists must', async () => {
      const item = {
        id: UNIQUE_UUID,
        email: 'email',
        name: 'name',
      };

      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve(item));
      //@ts-ignore
      repository.remove.mockImplementation(() => Promise.resolve());

      expect(await service.remove(UNIQUE_UUID)).toEqual(undefined);
    });

    it('when element not exists must return error', async () => {
      //@ts-ignore
      repository.findOne.mockImplementation(() => Promise.resolve());
      //@ts-ignore
      repository.remove.mockImplementation(() => Promise.resolve());

      expect(service.remove(UNIQUE_UUID)).rejects.toThrow(NotFoundException);
    });
  });
});
