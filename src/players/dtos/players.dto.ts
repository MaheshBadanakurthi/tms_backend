/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class newPlayer {
    @ApiProperty({description:'Name of the player', required: true, example: "Jhon"})
    @IsNotEmpty()
    @IsString()
    playerName: string;
    @ApiProperty({ description: 'Age', example: '24', required: true })
    @IsNotEmpty()
    @IsString()
    age: string;
    @ApiProperty({ description: "Sport", example: ['Cricket'], required: true })
    @IsNotEmpty()
    sport: string[];
    @ApiProperty({ description: "Provide profile url", example: 'http://192.168.0.22:4242/uploads/profiles/1732778352388.webp', required: false })
    @IsOptional()
    profilePicture?: string;
}