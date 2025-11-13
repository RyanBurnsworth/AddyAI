import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { DataService } from '../data/data.service';
import { v4 as uuidv4 } from 'uuid';
import { MailgunService } from '../mailgun/mailgun.service';
import { INTRO_EMAIL } from 'src/util/emails';

@Injectable()
export class UserService {
  constructor(private readonly dataService: DataService, private mailgunService: MailgunService) {}

  async upsertUser(userDto: UserDTO): Promise<User> {
    console.log('Upserting user: ', userDto.email);

    const user: User = {
      id: uuidv4(),
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
      console.log('User exists, updating user: ', existingUser.id);
      try {
        await this.dataService.updateUser({
          ...user,
          id: existingUser.id,
          createdAt: existingUser.createdAt,
          balance: existingUser.balance,
      });
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

      // send the intro email
      await this.mailgunService.sendEmail(
        createdUser.name,
        createdUser.email,
        'Welcome to AddyAI',
        "Thank you for joining AddyAI! We're excited to have you on board. Visit our dashboard to get started. https://www.addyai.net/chat",
        INTRO_EMAIL({ name: createdUser.name })
      );

      return createdUser;
    } catch (error) {
      console.log('Error creating new user: ', error);
      throw new InternalServerErrorException('Error creating new user: ', error);
    }
  }

  async getUserById(userId: string) {
    try {
      console.log('Fetching user by id: ', userId);

      return await this.dataService.findUserByUserId(userId);
    } catch (error) {
      console.log('Error fetching user by id: ', error);
      throw error;
    }
  }
}
