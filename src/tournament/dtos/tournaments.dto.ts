/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class TournamentProfileDto {
    @IsOptional()
    @IsString()
    logo?: string;
    @IsOptional()
    @IsString()
    description?: string
}
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
    // @IsOptional()
    // @Type(() => TournamentProfileDto)
    // profile?: TournamentProfileDto
    @IsOptional()
    @IsString()
    profile?: string | null;
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date
    @IsOptional()
    @IsNumber()
    @Min(2)
    @Max(30)
    maxTeams?:number
}