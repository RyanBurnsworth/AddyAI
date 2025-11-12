import { Module } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { GoogleService } from './service/google/google.service';
import { AuthController } from './controller/auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from './service/jwt/jwt.service';
import { DataController } from './controller/data/data.controller';
import { PostgresModule } from './postgres.module';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data.module';
import { DataService } from './service/data/data.service';
import { SyncService } from './service/sync/sync.service';
import { SyncController } from './controller/sync/sync.controller';
import { AccountService } from './service/account/account.service';
import { AccountController } from './controller/account/account.controller';
import { ConversationController } from './controller/conversation/conversation.controller';
import { ConversationService } from './service/conversation/conversation.service';
import { LLMController } from './controller/llm/llm.controller';
import { LLMService } from './service/llm/llm.service';
import { PaymentController } from './controller/payment/payment.controller';
import { PaymentService } from './service/payment/payment.service';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: seconds(60),
      limit: 10,
    }]),
    PostgresModule,
    HttpModule,
    DataModule,
  ],
  controllers: [
    AuthController,
    DataController,
    SyncController,
    AccountController,
    ConversationController,
    LLMController,
    PaymentController,
  ],
  providers: [
    AuthService,
    GoogleService,
    JwtService,
    DataService,
    SyncService,
    AccountService,
    ConversationService,
    LLMService,
    PaymentService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
