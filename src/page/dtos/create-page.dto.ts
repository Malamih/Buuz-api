import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
