import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Services } from '../schemas/client.schema';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsEmail({ allow_display_name: true }, { message: 'Email is not vaild.' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly phone_number: string;
  @IsNotEmpty()
  @IsString()
  readonly message: string;
  @IsNotEmpty()
  @IsEnum(Services, {
    each: true,
    message:
      'Please choose one or more of these services: [Commercial, Films ,Short films, Series, TV Programs, Video Clip, Sketch]',
  })
  @IsArray()
  readonly services: Services[];
}
