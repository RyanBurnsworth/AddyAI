import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '../jwt/jwt.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;
  let jwtService: JwtService;

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockJwtService = {
    decodeToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authorizeUser', () => {
    const code = 'test-auth-code';
    const mockIdToken = 'mock-id-token';
    const mockDecodedToken = {
      payload: {
        name: 'Test User',
        email: 'test@example.com',
        picture: 'http://example.com/pic.jpg',
      },
    };

    const mockOAuthResponse: AxiosResponse = {
      data: {
        id_token: mockIdToken,
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'email profile',
        refresh_token_expires_in: 7200,
        idToken: mockIdToken,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
        url: '',
        method: 'post',
      } as any,
    };

    it('should authorize the user and return token data', async () => {
      mockHttpService.post.mockReturnValue(of(mockOAuthResponse));
      mockJwtService.decodeToken.mockReturnValue(mockDecodedToken);

      const result = await service.authorizeUser(code);

      expect(mockHttpService.post).toHaveBeenCalled();
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);
      expect(mockJwtService.decodeToken).toHaveBeenCalledWith(mockIdToken);
      expect(result).toEqual({
        token: {
          payload: mockDecodedToken.payload,
          data: mockOAuthResponse.data,
        },
      });
    });

    it('should throw InternalServerErrorException if id_token is missing', async () => {
      const responseWithoutIdToken = {
        ...mockOAuthResponse,
        data: { ...mockOAuthResponse.data, id_token: undefined },
      };
      const mockErrorResponse = 'Error Retrieving Id Token';

      mockHttpService.post.mockReturnValue(of(responseWithoutIdToken));

      await expect(service.authorizeUser(code)).rejects.toThrow(
        new InternalServerErrorException(mockErrorResponse)
      );
    });

    it('should throw InternalServerErrorException if token decoding fails', async () => {
      const mockErrorResponse = 'Error Decoding Token';

      mockHttpService.post.mockReturnValue(of(mockOAuthResponse));
      mockJwtService.decodeToken.mockReturnValue(undefined);

      await expect(service.authorizeUser(code)).rejects.toThrow(
        new InternalServerErrorException(mockErrorResponse)
      );
    });

    it('should throw an error if the request fails', async () => {
      const error = new Error('Request failed');
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.authorizeUser(code)).rejects.toThrow(
        new InternalServerErrorException(error)
      );
    });
  });
});
