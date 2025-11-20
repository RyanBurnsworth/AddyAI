import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { DataService } from '../data/data.service';
import { v4 as uuidv4 } from 'uuid';
import { MailgunService } from '../mailgun/mailgun.service';
import { DEACTIVATION_EMAIL, GOOGLE_ADS_DELETED_EMAIL, INTRO_EMAIL } from 'src/util/emails';

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
      modelPreference: userDto?.modelPreference,
      active: userDto.active || true,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    let existingUser: User = await this.getExistingUser(user.email);

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

  async deactivateUser(email: string) {
    const existingUser =  await this.getExistingUser(email);

    if (!existingUser) {
      console.log('User not found for email: ', email);
      throw new InternalServerErrorException('User not found');
    }

    console.log('Deactivating user: ', existingUser.id);

    const user: User = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      picture: '',
      refreshToken: '',
      accessToken: '',
      expiresIn: null,
      refreshTokenExpiresIn: null,
      tokenType: null,
      scope: null,
      idToken: null,
      balance: existingUser.balance,
      modelPreference: null,
      active: false,
      lastUpdated: new Date(),
      createdAt: existingUser.createdAt,
    };

    // update user to set active to false
 

    // delete user Google Ads data on Addy AI
    try {
      await this.deleteGoogleAdsData(existingUser.id);
    } catch (error) {
      console.log('Error deleting Google Ads data: ', error);
      throw new InternalServerErrorException('Error deleting Google Ads data');
    }

    // send a deactivation email
    try {
      await this.mailgunService.sendEmail(
        existingUser.name, 
        existingUser.email, 
        'Account Deactivated', 
        'Your AddyAI account has been deactivated.', 
        DEACTIVATION_EMAIL({ name: existingUser.name }));
    } catch(error) {
      console.log('Error sending deactivation email: ', error);
      throw new InternalServerErrorException('Error sending deactivation email');
    }
  }

  async clearGoogleAdsDataByUserId(email: string) {
    try {
      const existingUser =  await this.getExistingUser(email);

      if (!existingUser) {
        console.log('User not found for email: ', email);
        throw new InternalServerErrorException('User not found');
      }

      await this.deleteGoogleAdsData(email);
      
      // send a Google Ads cleared email
      await this.mailgunService.sendEmail(
        existingUser.name, 
        existingUser.email, 
        'Google Ads Data Deleted in AddyAI', 
        'Your Google Ads data has been successfully deleted from AddyAI.', 
        GOOGLE_ADS_DELETED_EMAIL({ name: existingUser.name }));
    } catch (error) {
      console.log('Error clearing Google Ads data: ', error);
      throw error;
    }
  }

  private async deleteGoogleAdsData(email: string) {
    try {
      await this.dataService.deleteGoogleAdsDataByUserId(email);
    } catch (error) {
      console.log('Error deleting user Google Ads data: ', error);
      throw new InternalServerErrorException('Error deleting user Google Ads data');
    }
  }
  
  private async getExistingUser(email: string): Promise<User | null> { 
    let existingUser: User;

    try {
      existingUser = await this.dataService.findUserByEmail(email);
    } catch (error) {
      console.log('User does not exist for email: ', email);
    }

    return existingUser;
  }
}
