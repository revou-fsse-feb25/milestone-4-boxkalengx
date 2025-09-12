import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEnum(Role)
    role: Role;
}
