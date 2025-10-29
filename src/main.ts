import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set global prefix /api/
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // set versioning /api/v1/
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // global validation for DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // global interceptor like @Exclude
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
