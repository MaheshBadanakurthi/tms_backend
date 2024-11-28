import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class registerDataTypes {
    @ApiProperty({ description: "Name of the user", example: "Mahesh", required: true })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ description: "Email of the user", example: "mahi@gmail.com", required: true })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    @ApiProperty({ description: "Set password", example: "Mahi@123", required: true })
    @IsString()
    @IsNotEmpty()
    password: string;
    @ApiProperty({ description: "Mobile number", example: "7896541233", required: true })
    @IsString()
    @IsNotEmpty()
    mobile: number
}
export class LoginDto {
    @ApiProperty({example:'Mahi@gmail.com', required:true})
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ example: "Mahi@123", required: false })
    @IsString()
    @IsNotEmpty()
    password: string;
}