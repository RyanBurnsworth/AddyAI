import { Body, Controller, Post } from '@nestjs/common';
import { SyncRequest } from '../../model/sync.request.model';
import { SyncService } from '../../service/sync/sync.service';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 3, ttl: 60000 } })
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('')
  async sync(@Body() syncRequest: SyncRequest) {
    try {
      await this.syncService.performAttributeSync(syncRequest);
      return await this.syncService.performMetricSync(syncRequest);
    } catch (error) {
      throw error;
    }
  }
}
