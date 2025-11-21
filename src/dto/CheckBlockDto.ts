import { IsArray, IsNotEmpty } from 'class-validator';

export class CheckBlockDto {
  @IsArray()
  @IsNotEmpty()
  members: string[];
}
