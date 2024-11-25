/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { newTournament } from './dtos/tournaments.dto';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
    constructor(private tourService: TournamentService) { }
    @Get()
    async getAllTournaments() {
        return this.tourService.getAllTournaments()
    }

    @Post('/creation')
    async createNewTournament(@Body(new ValidationPipe()) tournamentData: newTournament) {
        return this.tourService.createTournament(tournamentData)
    }

    @Put(':id')
    async updateTournament(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: Partial<newTournament>) {
        this.tourService.updateTournamentData(id, updateData)
    }
    // Delete Tournament
    async deleteTournament(@Param('id') id: string) {
        this.tourService.deleteTournament(id)
    }

}
