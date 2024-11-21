import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class newPlayer{
    name:string;
    age:number;
    sport:string;
    teams:string[];
    profilePicture:string;

}