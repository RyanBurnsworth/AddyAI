import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '../jwt/jwt.service';
import { AuthorizationResponse } from '../../model/authorization.response.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService
  ) {}

  async authorizeUser(code: string): Promise<AuthorizationResponse> {
    const url = process.env.GOOGLE_TOKEN_URL;
    const payload = this.buildOAuthPayload(code);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      const id_token = response.data.id_token;
      if (!id_token) {
        console.log('Error Retreiving Id Token');
        throw new InternalServerErrorException('Error Retrieving Id Token');
      }

      const token = this.jwtService.decodeToken(response.data.id_token);
      if (!token) {
        console.log('Error decoding token');
        throw new InternalServerErrorException('Error Decoding Token');
      }

      return {
        token: {
          payload: token.payload,
          data: response.data,
        },
      };
    } catch (error) {
      console.error('Token exchange failed:}', code, ' for reason: ', error);
      throw new InternalServerErrorException(error);
    }
  }

  private buildOAuthPayload(code: string) {
    const scopes = [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/adwords'
    ].join(' ');

    const payload = new URLSearchParams();
    payload.append('code', code);
    payload.append('client_id', process.env.GOOGLE_APP_ID);
    payload.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    payload.append('redirect_uri', process.env.GOOGLE_REDIRECT_URL);
    payload.append('grant_type', 'authorization_code');
    payload.append('scope', scopes);
    return payload;
  }
}
