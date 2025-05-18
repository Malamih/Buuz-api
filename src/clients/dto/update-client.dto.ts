import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Services } from '../schemas/client.schema';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  readonly name: string;
  @IsEmail({}, { message: 'Email is not valid.' })
  @IsString()
  readonly email: string;
  @IsOptional()
  @IsString()
  readonly phone_number: string;
  @IsOptional()
  @IsString()
  readonly message: string;
  @IsOptional()
  @IsEnum(Services, { each: true })
  @IsArray()
  readonly services: Services[];
}
