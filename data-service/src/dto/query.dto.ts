import { IsArray } from 'class-validator';

export class QueryDTO {
  @IsArray()
  queries: string[];
}
