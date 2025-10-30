import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { DataService } from '../data/data.service';

@Injectable()
export class UserService {
  constructor(private readonly dataService: DataService) {}

  async upsertUser(userDto: UserDTO): Promise<User> {
    console.log('Upserting user: ', userDto.email);

    const user: User = {
      id: null,
      name: userDto.name,
      email: userDto.email,
      picture: userDto.picture,
      refreshToken: userDto.refreshToken,
      accessToken: userDto.accessToken,
      expiresIn: userDto?.expiresIn,
      refreshTokenExpiresIn: userDto?.refreshTokenExpiresIn,
      tokenType: userDto?.tokenType,
      scope: userDto?.scope,
      idToken: userDto?.idToken,
      balance: 1000,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    let existingUser: User;

    try {
      existingUser = await this.dataService.findUserByEmail(user.email);
    } catch (error) {
      console.log('User does not exist', {
        userId: user.id,
      });
    }

    if (existingUser) {
      console.log('User exists, updating user: ', user.email);
      try {
        await this.dataService.updateUser(user);
      } catch (error) {
        console.log('Error updating existing user: ', error);
        throw new InternalServerErrorException('Error updating existing user');
      }

      try {
        return await this.dataService.findUserByEmail(user.email);
      } catch (error) {
        console.log('Error fetching updated user:', error);
        throw new InternalServerErrorException('Error fetching updated user');
      }
    }

    try {
      console.log('Creating new user: ', user.email);
      const createdUser = await this.dataService.createUser(user);
      return createdUser;
    } catch (error) {
      console.log('Error creating new user: ', error);
      throw new InternalServerErrorException('Error creating new user: ', error);
    }
  }

  async getUserById(userId: number) {
    try {
      console.log('Fetching user by id: ', userId);

      return await this.dataService.findUserByUserId(userId);
    } catch (error) {
      console.log('Error fetching user by id: ', error);
      throw error;
    }
  }
}
