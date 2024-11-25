/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

// Specify the exact path to your .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

   // Serve static files
   app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Set the URL prefix
});
  // Explicitly log to verify
  // console.log('Environment:', process.env);
  
  const ip = '192.168.0.175';
  const port = 4242;

  console.log(`IP: ${ip}, PORT: ${port}`);
  console.log(`Server is running on http://${ip}:${port}`);
  
  app.enableCors();
  await app.listen(port, ip);
}
bootstrap();