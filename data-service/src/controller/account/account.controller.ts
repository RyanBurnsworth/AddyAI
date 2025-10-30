import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { AccountService } from '../../service/account/account.service';
import { Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('')
  async getAccounts(
    @Res() res: Response,
    @Query('user_id') userId: number,
    @Query('refresh_token') refreshToken: string
  ) {
    if (!userId || !refreshToken) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            'Missing parameters userId or refreshToken: ' +
              { userId: userId, refreshToken: refreshToken }
          )
        );
    }

    try {
      const accounts = await this.accountService.fetchAccounts(userId, refreshToken);

      if (!accounts || accounts.length == 0)
        return res.status(404).json(new NotFoundException('No Google Ads Accounts Found!'));

      return res.status(200).json(accounts);
    } catch (error) {
      console.log('Error getting accounts: ', error);
      return res
        .status(error?.status ?? 500)
        .json(error?.message ?? new InternalServerErrorException('Error fetching accounts'));
    }
  }

  @Get('sync')
  async getLastSyncDate(@Query('customerId') customerId: string) {
    const lastSync = await this.accountService.getLastSyncDate(customerId);
    return lastSync;
  }
}
