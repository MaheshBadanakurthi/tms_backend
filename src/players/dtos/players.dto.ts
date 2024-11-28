/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class newPlayer {
    @IsNotEmpty()
    @IsString()
    playerName: string;
    @IsNotEmpty()
    @IsString()
    age: string;
    @IsNotEmpty()
    sport: string[];
    @IsOptional()
    profilePicture?: string;
}