import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          service: 'gmail',
          auth: {
            user: config.getOrThrow<string>('EMAIL_USER'),
            pass: config.getOrThrow<string>('EMAIL_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2',
          },
        },
        defaults: {
          from: `"No Reply" <${config.getOrThrow<string>('EMAIL_USER')}>`,
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
