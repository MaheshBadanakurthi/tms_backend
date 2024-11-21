import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const ip = '192.168.0.22';
  const port = 4242;

  console.log(`Server is running on http://${ip}:${port}`);
  app.enableCors();
  await app.listen(port, ip);
}
bootstrap();
