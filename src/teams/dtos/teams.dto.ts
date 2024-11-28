/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from "class-validator";

export class NewTeam {
    @IsString()
    @IsNotEmpty()
    teamName: string;
    @IsString()
    @IsNotEmpty()
    sport: string;
    @IsNotEmpty()
    players: string[]
}