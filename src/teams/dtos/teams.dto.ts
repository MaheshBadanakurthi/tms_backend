/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NewTeam {
    @ApiProperty({ description: 'Name of the team', required: true, example: "Team A" })
    @IsString()
    @IsNotEmpty()
    teamName: string;
    @ApiProperty({ description: 'Name of Sport', example: 'Cricket', required: true })
    @IsString()
    @IsNotEmpty()
    sport: string;
    @ApiProperty({ description: "Players", example: ['Team A'], required: true })
    @IsNotEmpty()
    players: string[]
}