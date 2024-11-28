import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Specify the exact path to your .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Set the URL prefix
  });
  const config = new DocumentBuilder()
    .setTitle('TMS Swagger')
    .setDescription('Tournament Manage System have the following APIs')
    .setVersion('1.0')
    .addTag('TMS')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  // Explicitly log to verify
  // console.log('Environment:', process.env);

  const ip = '192.168.0.22';
  const port = 4242;

  console.log(`IP: ${ip}, PORT: ${port}`);
  console.log(`Server is running on http://${ip}:${port}`);

  app.enableCors();
  await app.listen(port, ip);
}
bootstrap();