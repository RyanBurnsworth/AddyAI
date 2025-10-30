import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exchange } from 'src/entity/conversation.entity';

export class ConversationDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsNotEmpty()
  exchange: Exchange[];
}
