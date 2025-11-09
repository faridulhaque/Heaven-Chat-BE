import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;
}
