import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exchange } from 'src/entity/conversation.entity';

export class ConversationDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsNotEmpty()
  exchange: Exchange[];
}
