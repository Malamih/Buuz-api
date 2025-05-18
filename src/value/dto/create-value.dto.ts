import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateValueDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;
    @IsNotEmpty()
    @IsString()
    readonly description: string;
    @IsOptional()
    @IsMongoId()
    readonly page: any;
}