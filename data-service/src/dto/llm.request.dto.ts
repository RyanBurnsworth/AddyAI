import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LLMRequestDTO {
  @IsNumber()
  @IsOptional()
  conversationId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  userPrompt: string;
}
