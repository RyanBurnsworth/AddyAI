import { Body, Controller, Get, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { UserDTO } from '../../dto/user.dto';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put()
  async upsert(@Res() res: Response, @Body() userDTO: UserDTO) {
    try {
      const user = await this.userService.upsertUser(userDTO);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json('Failed to validate user: ' + error);
    }
  }

  @Get()
  async getUser(@Query('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get('balance')
  async getUserBalance(@Res() res: Response, @Query('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      return res.status(200).json(user.balance);
    } catch (error) {
      return res.status(500).json('Failed to get user balance: ' + error);
    }
  }
}
