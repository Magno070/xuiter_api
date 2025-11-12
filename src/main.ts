import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    // origin: 'http://192.168.99.74:8080',
  });

  await app.listen(process.env.PORT ?? 3001, '192.168.99.74');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
