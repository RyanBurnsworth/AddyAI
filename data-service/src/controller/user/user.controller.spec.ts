import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../service/user/user.service';
import { UserDTO } from '../../dto/user.dto';
import { Response } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  beforeEach(async () => {
    mockUserService = {
      upsertUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('PUT /user', () => {
    it('should return 201 and user on success', async () => {
      const userDto: UserDTO = {
        email: 'test@example.com',
        name: 'Test User',
        picture: '',
        refreshToken: '',
        accessToken: '',
        expiresIn: 0,
        refreshTokenExpiresIn: 0,
        tokenType: '',
        scope: '',
        idToken: '',
      };

      const createdUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const res = mockResponse();
      mockUserService.upsertUser.mockResolvedValue(createdUser);

      await controller.upsert(res, userDto);

      expect(mockUserService.upsertUser).toHaveBeenCalledWith(userDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it('should return 500 on service error', async () => {
      const userDto: UserDTO = {
        email: 'fail@example.com',
        name: 'Fail User',
        picture: '',
        refreshToken: '',
        accessToken: '',
        expiresIn: 0,
        refreshTokenExpiresIn: 0,
        tokenType: '',
        scope: '',
        idToken: '',
      };

      const res = mockResponse();
      mockUserService.upsertUser.mockRejectedValue(new Error('DB error'));

      await controller.upsert(res, userDto);

      expect(mockUserService.upsertUser).toHaveBeenCalledWith(userDto);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Failed to validate user');
    });
  });
});
