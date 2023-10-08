import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { OutputCustomer } from './dto/output-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<OutputCustomer> {
    return this.customerService.create(createCustomerDto);
  }

  @Get('searchAllFields')
  searchAllFields(@Query('text') text: string) {
    if (!text) {
      throw new BadRequestException('Require query string text');
    }
    return this.customerService.searchAllFields(text);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    console.log({ id, updateCustomerDto });
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
