import { Body, Controller, Get, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { UserDTO } from '../../dto/user.dto';
import { Response } from 'express';

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
  async getUser(@Query('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Get('balance')
  async getUserBalance(@Query('id') id: number) {
    const user = await this.userService.getUserById(id);
    return user.balance;
  }
}
