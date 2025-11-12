import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { AuthorizationResponse } from 'src/model/authorization.response.model';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async authorize(@Query('code') code: string): Promise<AuthorizationResponse> {
    try {
      // Authorize the user via Google OAuth2
      return await this.authService.authorizeUser(code);
    } catch (ex) {
      throw new UnauthorizedException('Invalid authorization code');
    }
  }
}
