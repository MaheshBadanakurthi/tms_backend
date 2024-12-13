import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', 
  });

  const config = new DocumentBuilder()
    .setTitle('TMS Swagger')
    .setDescription('Tournament Manage System have the following APIs')
    .setVersion('1.0')
    .addTag('TMS')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // Name used in Swagger UI
    ) 
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const ip = configService.get<string>('IP', '0.0.0.0');
  const port = configService.get<number>('PORT', 4242);
  console.log(`IP: ${ip}, PORT: ${port}`);
  console.log(`Server is running on http://${ip}:${port}`);
  app.enableCors();
  await app.listen(port, ip);
}
bootstrap();