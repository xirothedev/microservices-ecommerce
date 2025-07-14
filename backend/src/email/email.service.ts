import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { VerifyEmailProps, MfaCodeProps } from './email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendVerifyEmail({ code, email, url }: VerifyEmailProps) {
    const html = await this.extractHtml('verify-email', {
      '{{VERIFICATION_LINK}}': url,
      '{{VERIFICATION_CODE}}': code,
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      html,
    });
  }

  public async sendMfaCode({ code, email }: MfaCodeProps) {
    const html = await this.extractHtml('mfa-code', {
      '{{MFA_CODE}}': code,
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'MFA Verification Code',
      html,
    });
  }

  private async extractHtml(htmlName: string, params?: { [x: string]: string }) {
    const templatePath = join(__dirname, 'templates', `${htmlName}.html`);
    let templateHtml: string;
    try {
      templateHtml = await readFile(templatePath, 'utf8');

      if (params) {
        Object.keys(params).map((key) => {
          templateHtml = templateHtml.replaceAll(key, encodeURIComponent(params[key]));
        });
      }

      return templateHtml;
    } catch (error) {
      console.error(`Failed to read email template at ${templatePath}:`, error);
      throw new Error('Could not load email template:' + htmlName);
    }
  }
}
