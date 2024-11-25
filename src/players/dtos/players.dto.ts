/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class newPlayer{
    @IsNotEmpty()
    @IsString()
    name:string;
    @IsNotEmpty()
    @IsString()
    age:number;
    @IsNotEmpty()
    @IsString()
    sport:string[];
    @IsOptional()
    @IsNotEmpty()
    teams?:string[];
    @IsString()
    profilePicture:string;

}