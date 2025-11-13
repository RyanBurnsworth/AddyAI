import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LLMRequestDTO {
  @IsNumber()
  @IsOptional()
  conversationId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  userPrompt: string;
}
