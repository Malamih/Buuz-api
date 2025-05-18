import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsString()
  readonly client: string;
  @IsNotEmpty()
  @IsString()
  readonly type: string;
  @IsNotEmpty()
  @IsString()
  readonly thumbnail: string;
  @IsNotEmpty()
  @IsString()
  readonly video: string;
  @IsNotEmpty()
  @IsString()
  readonly created_time: string;
  @IsNotEmpty()
  @IsString()
  readonly project_id: string;
  @IsNotEmpty()
  @IsString()
  readonly video_uri: string;
  @IsOptional()
  @IsMongoId()
  readonly page: any;
}
