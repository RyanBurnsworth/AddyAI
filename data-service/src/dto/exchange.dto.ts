import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExchangeDTO {
  @IsNumber()
  @IsNotEmpty()
  conversationId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  input: string; // user input

  @IsString()
  @IsNotEmpty()
  output: string; // LLM output
}
