import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DataService } from '../data/data.service';
import { UserDTO } from 'src/dto/user.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/entity/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let dataService: jest.Mocked<DataService>;

  const mockUserDto: UserDTO = {
    name: 'John Doe',
    email: 'john@example.com',
    picture: 'pic.jpg',
    refreshToken: 'refresh-token',
    accessToken: 'access-token',
    expiresIn: 3600,
    refreshTokenExpiresIn: 7200,
    tokenType: 'Bearer',
    scope: 'read write',
    idToken: 'id-token',
    customerId: '12345',
  };

  const mockUser: User = {
    ...mockUserDto,
    id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DataService,
          useValue: {
            findUserByCustomerId: jest.fn(),
            updateUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    dataService = module.get(DataService);
  });

  it('should create a new user if not found', async () => {
    dataService.findUserByCustomerId.mockResolvedValueOnce(null); // first check
    dataService.createUser.mockResolvedValueOnce(mockUser);

    const result = await userService.upsertUser(mockUserDto);

    expect(dataService.findUserByCustomerId).toHaveBeenCalledWith(mockUserDto.customerId);
    expect(dataService.createUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should update existing user if found', async () => {
    dataService.findUserByCustomerId
      .mockResolvedValueOnce(mockUser) // first check
      .mockResolvedValueOnce({ ...mockUser, name: 'Updated' }); // after update

    const updatedUser = await userService.upsertUser(mockUserDto);

    expect(dataService.updateUser).toHaveBeenCalled();
    expect(dataService.findUserByCustomerId).toHaveBeenCalledTimes(2);
    expect(updatedUser.name).toBe('Updated');
  });

  it('should throw if update fails', async () => {
    dataService.findUserByCustomerId.mockResolvedValueOnce(mockUser);
    dataService.updateUser.mockRejectedValueOnce(new Error('Update failed'));

    await expect(userService.upsertUser(mockUserDto)).rejects.toThrow(InternalServerErrorException);
    expect(dataService.updateUser).toHaveBeenCalled();
  });

  it('should throw if fetching updated user fails', async () => {
    dataService.findUserByCustomerId
      .mockResolvedValueOnce(mockUser) // first fetch
      .mockRejectedValueOnce(new Error('Fetch after update failed')); // second fetch

    dataService.updateUser.mockResolvedValueOnce();

    await expect(userService.upsertUser(mockUserDto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if createUser fails', async () => {
    dataService.findUserByCustomerId.mockResolvedValueOnce(null);
    dataService.createUser.mockRejectedValueOnce(new Error('Create failed'));

    await expect(userService.upsertUser(mockUserDto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should not throw if fetching user initially fails (silent)', async () => {
    dataService.findUserByCustomerId.mockRejectedValueOnce(new Error('DB down'));
    dataService.createUser.mockResolvedValueOnce(mockUser);

    const result = await userService.upsertUser(mockUserDto);
    expect(result).toEqual(mockUser);
  });
});
