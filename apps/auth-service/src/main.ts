import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth-service',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'auth-service-group',
        },
      },
    },
  );
  await app.listen();
  console.log('Auth Service is listening on Kafka');
}
bootstrap().catch((error) => {
  console.error('Error starting Auth Service:', error);
  process.exit(1);
});
