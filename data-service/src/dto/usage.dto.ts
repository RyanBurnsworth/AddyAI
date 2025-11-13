import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsageDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  inputTokens: number;

  @IsNumber()
  @IsNotEmpty()
  outputTokens: number;
}
