import { IsArray, IsNotEmpty, IsString, IsObject, IsOptional } from "class-validator";


export class EmailDto {
    @IsArray()
    @IsNotEmpty()
    to: string[];

    @IsString()
    @IsNotEmpty()
    subject: string;

    template: string;

    @IsObject()
    body: object;

    @IsString()
    @IsOptional()
    html?: string;
}