import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamodbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ region: 'us-east-1' }),
    }),
    CustomerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
