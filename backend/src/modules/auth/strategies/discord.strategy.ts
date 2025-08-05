import { DiscordProfile } from '@/modules/auth/auth.interface';
// import { SocialService } from '@/modules/auth/social.service' // TODO: Create SocialService
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private logger = new Logger(DiscordStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    // private readonly socialService: SocialService, // TODO: Create SocialService
  ) {
    super({
      clientID: configService.getOrThrow<string>('discord.oauthClientId'),
      clientSecret: configService.getOrThrow<string>('discord.oauthClientSecret'),
      callbackURL: configService.getOrThrow<string>('discord.oauthCallbackUrl'),
      scope: ['identify', 'email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: DiscordProfile) {
    try {
      // TODO: Implement social service
      // const user = await this.socialService.validateDiscordUser(profile)
      // return user
      throw new Error('SocialService not implemented yet');
    } catch (error) {
      this.logger.error('Discord Strategy - Error validating user:', error);
      throw error;
    }
  }
}
