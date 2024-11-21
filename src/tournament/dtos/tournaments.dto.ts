import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class newTournament {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    sport: string;
   
    @IsNotEmpty()
    teams: string[]
    @IsOptional()
    pools?: number
    @IsOptional()
    format?: string
}