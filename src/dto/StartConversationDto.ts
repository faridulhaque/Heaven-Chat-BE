import { IsArray, IsNotEmpty } from 'class-validator';

export class StartConversationDto {
  @IsArray()
  @IsNotEmpty()
  members: string[];
}
