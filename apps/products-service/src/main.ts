import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductsServiceModule } from './products.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductsServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'products-service',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'products-service-group',
        },
      },
    },
  );
  await app.listen();
  console.log('Product Service is listening on Kafka');
}
bootstrap().catch((error) => {
  console.error('Error starting Product Service:', error);
  process.exit(1);
});
