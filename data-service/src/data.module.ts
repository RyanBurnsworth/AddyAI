import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user/user.service';
import { User } from './entity/user.entity';
import { UserController } from './controller/user/user.controller';
import { AccountAttr } from './entity/account.attr.entity';
import { CampaignAttr } from './entity/campaign.attr.entity';
import { AdGroupAttr } from './entity/adgroup.attr.entity';
import { AdAttr } from './entity/ad.attr.entity';
import { KeywordAttr } from './entity/keyword.attr.entity';
import { DataService } from './service/data/data.service';
import { Usage } from './entity/usage.entity';
import { UsageService } from './service/usage/usage.service';
import { UsageController } from './controller/usage/usage.controller';
import { Account } from './entity/account.entity';
import { Conversation } from './entity/conversation.entity';
import { CampaignMetrics } from './entity/campaign.metrics.entity';
import { AdGroupMetrics } from './entity/adgroup_metrics.entity';
import { AdMetrics } from './entity/ad.metrics.entity';
import { KeywordMetrics } from './entity/keyword.metrics.entity';
import { Transaction } from './entity/transaction.entity';
import { MailgunService } from './service/mailgun/mailgun.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AccountAttr,
      CampaignAttr,
      AdGroupAttr,
      AdAttr,
      KeywordAttr,
      Usage,
      Account,
      Conversation,
      CampaignMetrics,
      AdGroupMetrics,
      AdMetrics,
      KeywordMetrics,
      Transaction,
    ]),
  ],
  controllers: [UserController, UsageController],
  providers: [DataService, UserService, UsageService, MailgunService],
  exports: [DataService, UserService, UsageService],
})
export class DataModule {}
