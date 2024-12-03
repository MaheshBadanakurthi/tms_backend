import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
export interface teamsInterface {
    players: string[],
    id: string,
    sport: string | string[],
    teamName: string
}
export class newTournament {
    @ApiProperty({ description: 'Name of the tournament', required: true, example: "IPL" }) // for Swagger documentation
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ description: 'Tournament description', example: 'This is biggest T20 league', required: false }) // for Swagger documentation
    @IsOptional()
    description: string;
    @ApiProperty({ description: 'Type of Sport', example: 'Cricket', required: true })
    @IsString()
    @IsNotEmpty()
    sport: string;
    @ApiProperty({ description: "Teams", example: ['Team A'], required: false })
    @IsNotEmpty()
    teams: teamsInterface[]
    @IsOptional()
    pools?: number
    @ApiProperty({ description: 'Provide sport format', example: 'Single Elimination', required: false })
    @IsOptional()
    format?: string | null
    @ApiProperty({ description: "Provide profile url", example: 'http://192.168.0.22:4242/uploads/profiles/1732778352388.webp', required: false })
    @IsOptional()
    @IsString()
    profile?: string | null;
    @ApiProperty({ description: "Provide start date", example: "2024-12-18T18:30:00.000Z", required: false })
    @IsDate()
    @Type(() => Date)
    startDate?: Date
    @ApiProperty({ description: "Provide end date", example: "2024-12-18T18:30:00.000Z", required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date
    @ApiProperty({ description: "Provide max teams", example: "10", required: false })
    @IsNumber()
    @Min(2)
    @Max(30)
    maxTeams?: number
}
export interface FormatMatchesData {
    match: string,
    round: number,
    team1: { players: [], sports: string[], teamName: string }
    team2: { players: [], sports: string[], teamName: string }
}