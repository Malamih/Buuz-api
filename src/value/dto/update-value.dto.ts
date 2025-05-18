import { IsOptional, IsString } from 'class-validator';

export class UpdateValueDto {
  @IsOptional()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly description: string;
}
