import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsageDTO } from '../../dto/usage.dto';
import { UsageService } from '../../service/usage/usage.service';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post('')
  async saveUsageRecord(@Res() res: Response, @Body() usageDto: UsageDTO) {
    try {
      await this.usageService.insertTokens(usageDto);
      return res.status(201).json();
    } catch (error) {
      console.log('Error posting usage: ', error);
      throw error;
    }
  }

  @Get('')
  async getUsage(@Res() res: Response, @Query('userId') userId: string) {
    try {
      const tokenUsage = this.usageService.getTokenUsageByUserId(userId);
      return res.status(200).json(tokenUsage);
    } catch (error) {
      return res.status(500).json('Error fetching usage for user');
    }
  }

  @Get('aggregate')
  async getUsageByDay(@Res() res: Response, @Query('userId') userId: string) {
    try {
      const usages = await this.usageService.getTokenUsageByUserId(userId);
      const aggregate = await this.usageService.aggregateDailyTotals(usages);
      return res.status(200).json(aggregate);
    } catch (error) {
      throw new InternalServerErrorException('Error getting usage by day for user');
    }
  }
}
