import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../service/auth/auth.service';
import { AuthorizationResponse } from 'src/model/authorization.response.model';
import { TokenModel } from 'src/model/token.model';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    authorizeUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should call authorizeUser with the given code and return the result', async () => {
    const code = 'test-auth-code';

    const tokenModel: TokenModel = {
      payload: {
        name: 'User name',

        email: 'user@email.com',

        picture: 'http://my-picture.com',
      },

      data: {
        refresh_token: 'refresh token',

        access_token: 'access token',

        expires_in: 2030,

        refresh_token_expires_in: 324234,

        token_type: 'bearer',

        scope: 'scope',

        id_token: 'id token',
      },
    };

    const mockResponse: AuthorizationResponse = {
      token: tokenModel,
    };

    mockAuthService.authorizeUser.mockResolvedValue(mockResponse);

    const result = await controller.authorize(code);

    expect(service.authorizeUser).toHaveBeenCalledWith(code);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an UnauthorizedException when authorization fails', async () => {
    const code = 'bad-auth-code';
    const errorMessage = 'Invalid authorization code';

    // Simulate the service throwing an exception
    mockAuthService.authorizeUser.mockRejectedValueOnce(new UnauthorizedException(errorMessage));

    await expect(controller.authorize(code)).rejects.toThrow(
      new UnauthorizedException(errorMessage)
    );
    expect(service.authorizeUser).toHaveBeenCalledWith(code);
  });
});
