import { Body, Controller, Post } from '@nestjs/common';
import { SyncRequest } from '../../model/sync.request.model';
import { SyncService } from '../../service/sync/sync.service';

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
