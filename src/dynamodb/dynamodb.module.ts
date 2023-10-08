import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { repositoryClasses } from './dynamodb.decorator';
import { ConfigurableModuleClass } from './dynamodb.module-definition';

@Module({})
export class DynamodbModule extends ConfigurableModuleClass {
  static forRootAsync(options: any): DynamicModule {
    const definition = super.forRootAsync(options);

    const ddbDocClientProvider: FactoryProvider<DynamoDBDocumentClient> = {
      provide: DynamoDBDocumentClient,
      inject: options.inject,
      useFactory: (...args) => {
        let ddbClientConfig: DynamoDBClientConfig = {};

        if (options.useFactory) {
          ddbClientConfig = options.useFactory(...args);
        }
        const ddbClient = new DynamoDBClient(ddbClientConfig);

        return DynamoDBDocumentClient.from(ddbClient, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
        });
      },
    };

    return {
      ...definition,
      providers: [ddbDocClientProvider, ...repositoryClasses],
      exports: [...repositoryClasses],
    };
  }
}
