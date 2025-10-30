import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsageDTO } from '../../dto/usage.dto';
import { DataService } from '../data/data.service';
import { Usage } from '../../entity/usage.entity';
import { AggregatedUsage } from '../../model/aggregated.usage.model';

@Injectable()
export class UsageService {
  constructor(private readonly dataService: DataService) {}

  /**
   * Fetch token usage records by user id
   *
   * @param userId the id of the user
   * @returns a list of usage records
   */
  async getTokenUsageByUserId(userId: string): Promise<Usage[]> {
    try {
      return await this.dataService.findUsageRecordsByUserId(userId);
    } catch (error) {
      console.log('error fetching token usage by userId: ', error);
      throw new InternalServerErrorException('Unable to fetch token usage for user');
    }
  }

  /**
   * Insert token usage into table
   *
   * @param usageDto the usage object
   */
  async insertTokens(usageDto: UsageDTO): Promise<void> {
    const { subCost, finalCost } = this.calculateUsage(
      usageDto.model,
      usageDto.inputTokens,
      usageDto.outputTokens
    );

    let user;
    try {
      user = await this.dataService.findUserByUserId(usageDto.userId);
    } catch (error) {
      console.log('Error fetching user by userId: ', error);
      throw new InternalServerErrorException('Service failed to find user');
    }

    if (!user) {
      console.log('Error finding user by userId: ', usageDto.userId);
      throw new NotFoundException('Could not find user: ', usageDto.userId.toString());
    }

    let balanceMicros = user.balance;
    const finalCostMicros = finalCost * 1000;

    if (balanceMicros < finalCostMicros) {
      console.log('The cost exceeds the balance: ', {
        cost: finalCostMicros / 1000,
        balance: balanceMicros / 1000,
      });
      throw new BadRequestException('Cost exceeds balance');
    }

    balanceMicros = balanceMicros - finalCostMicros;
    user.balance = Number(balanceMicros.toFixed(2));
    this.dataService.updateUser(user);

    const usage = new Usage();
    usage.userId = usageDto.userId;
    usage.cost = subCost;
    usage.finalCost = finalCost;
    usage.inputTokens = usageDto.inputTokens;
    usage.outputTokens = usageDto.outputTokens;
    usage.createdAt = new Date();

    try {
      this.dataService.createUsage(usage);
    } catch (error) {
      console.log('Error creating usage record: ', error);
      throw new InternalServerErrorException('Unable to create usage record');
    }
  }

  /**
   * Calculate usage cost
   *
   * @param model the LLM model used
   * @param inputTokens the number of input tokens
   * @param outputTokens the number of output tokens
   * @returns subCost and finalCost
   */
  private calculateUsage(
    model: string,
    inputTokens: number,
    outputTokens: number
  ): { subCost: number; finalCost: number } {
    let inputCost = 0;
    let outputCost = 0;

    switch (model) {
      case 'gpt-4.1':
        inputCost = 2; // $2 per million input tokens
        outputCost = 8; // $8 per million output tokens
        break;
      case 'o4-mini':
        inputCost = 1.1;
        outputCost = 4.4;
        break;
      default:
        break;
    }

    const inputTokenCost = inputCost * (inputTokens / 1000000);
    const outputTokenCost = outputCost * (outputTokens / 1000000);

    const subcost = inputTokenCost + outputTokenCost;
    const finalCost = subcost * 4;

    console.log('Costs info: ', {
      inputTokens: inputTokens,
      inputTokenCost: inputTokenCost,
      outputTokens: outputTokens,
      outputTokenCost: outputTokenCost,
      subcost: subcost,
      finalCost: finalCost,
    });

    return {
      subCost: Number(subcost),
      finalCost: Number(finalCost),
    };
  }

  /**
   * Aggregate the daily totals of usage
   *
   * @param usages an array of Usage objects
   * @returns a list of usage response
   */
  aggregateDailyTotals(usages: Usage[]): AggregatedUsage[] {
    const dailyTotals = new Map<
      string,
      { inputTokens: number; outputTokens: number; cost: number }
    >();

    for (const usage of usages) {
      const date = new Date(usage.createdAt).toISOString().split('T')[0]; // "YYYY-MM-DD"

      if (!dailyTotals.has(date)) {
        dailyTotals.set(date, {
          inputTokens: 0,
          outputTokens: 0,
          cost: 0,
        });
      }

      const dayTotals = dailyTotals.get(date)!;
      dayTotals.inputTokens += usage.inputTokens;
      dayTotals.outputTokens += usage.outputTokens;
      dayTotals.cost += usage.finalCost; // or usage.cost depending on what you want
    }

    // Convert to UsageResponse[]
    const aggregatedUsage: AggregatedUsage[] = Array.from(dailyTotals.entries()).map(
      ([date, totals]) => {
        const response = new AggregatedUsage();
        response.date = date;
        response.totalInputTokens = totals.inputTokens;
        response.totalOutputTokens = totals.outputTokens;
        response.totalCost = Number(totals.cost.toFixed(2));

        return response;
      }
    );

    return aggregatedUsage;
  }
}
