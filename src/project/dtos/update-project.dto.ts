import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly client: string;
  @IsOptional()
  @IsString()
  readonly type: string;
  @IsOptional()
  @IsString()
  readonly thumbnail: string;
  @IsOptional()
  @IsString()
  readonly video: string;
  @IsOptional()
  @IsString()
  readonly video_uri: string;
  @IsOptional()
  @IsString()
  readonly project_id: string;
}
