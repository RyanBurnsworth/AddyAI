import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentService } from 'src/service/payment/payment.service';

@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('create-session')
  async getClientSecret(@Query('amount') amount: number) {
    return await this.paymentService.requestClientSecret(amount);
  }

  // TODO: Should be handled wtihin a webhook
  @Get('status')
  async getPaymentStatus(@Query('user_id') userId: string, @Query('session_id') sessionId: string) {
    const session = await this.paymentService.getCheckoutSession(sessionId);
    if (!session) {
      return new NotFoundException('Transaction already has been processed');
    }

    if (session.status === 'complete') {
      this.paymentService.updateUserBalance(userId, session.amount_subtotal);
    }

    this.paymentService.createTransactionRecord(
      userId,
      session.id,
      session.amount_subtotal,
      session.status
    );
    return session.status;
  }
}
