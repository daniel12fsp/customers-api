import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupNestApp() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Customers example')
    .setDescription('The customers API description')
    .setVersion('1.0')
    .addServer(
      'https://99fyxf8tea.execute-api.us-east-1.amazonaws.com/dev',
      'production-server',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);

  return app;
}

async function bootstrap() {
  const app = await setupNestApp();
  await app.listen(3000);
}
bootstrap();
