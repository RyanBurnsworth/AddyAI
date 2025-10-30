import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { DataService } from '../data/data.service';
import { Transaction } from '../../entity/transaction.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly dataService: DataService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async requestClientSecret(amount: number): Promise<{ clientSecret: string }> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AddyAI Prepaid Credit',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        ui_mode: 'embedded',
        return_url: 'https://www.addyai.com/finish?session_id={CHECKOUT_SESSION_ID}',
      });

      return { clientSecret: session.client_secret };
    } catch (error) {
      console.log('Error requesting client secret: ', error);
      throw error;
    }
  }

  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const transaction = await this.dataService.findTransactionBySessionId(sessionId);
      if (transaction) {
        return null;
      }

      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.log('Error getting checkout session: ', error);
      throw error;
    }
  }

  async createTransactionRecord(userId: number, sessionId: string, amount: number, status: string) {
    const transaction = new Transaction();
    transaction.userId = userId;
    transaction.sessionId = sessionId;
    transaction.amount = amount;
    transaction.status = status;
    transaction.createdAt = new Date();

    try {
      await this.dataService.createTransactionRecord(transaction);
    } catch (error) {
      throw error;
    }
  }

  async updateUserBalance(userId: number, amount: number) {
    try {
      const user = await this.dataService.findUserByUserId(userId);
      user.balance = Number(user.balance) + amount * 10; // multiply by 10 so it stays consistent with Google Ads values being in micros

      await this.dataService.updateUser(user);
    } catch (error) {
      throw error;
    }
  }
}
