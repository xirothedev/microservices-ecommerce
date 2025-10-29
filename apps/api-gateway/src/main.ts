import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log('API Gateway is listening on http://localhost:3000');
}
void bootstrap();
