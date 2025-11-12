import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { QueryDTO } from '../../dto/query.dto';
import { DataService } from '../../service/data/data.service';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('/request')
  async executeMultipleQueries(@Body() queryDTO: QueryDTO) {
    try {
      return await Promise.all(queryDTO.queries.map(q => this.dataService.executeQuery(q)));
    } catch (error) {
      console.log('Error executing queries: ', error);
      return new BadRequestException('Error executing one or more queries');
    }
  }
}
