import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' })


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend development
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
    ['http://localhost:3000', 'http://localhost:3001'];
    
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('RANWIP Project Management API')
    .setDescription('API documentation for RANWIP LLC Project Management System')
    .setVersion('1.0')
    .addTag('projects')
    .addTag('tasks')
    .addTag('users')
    .addTag('teams')
    .addTag('comments')
    .addTag('time-entries')
    .addTag('sprints')
    .addTag('analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 RANWIP Project Management API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
}

bootstrap();