import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is not valid, please try a diffrent one.' })
  email: string;
  @IsNotEmpty()
  password: string;
}
