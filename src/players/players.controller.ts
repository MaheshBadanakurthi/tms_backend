/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { PlayersService } from './players.service';
import { newPlayer } from './dtos/players.dto';

@Controller('players')
export class PlayersController {

    constructor(private playerService:PlayersService){}
    @Get()
    async getAllPlayers(){
        return this.playerService.getAllPlayers()
    }
    @Post()
    async createNewTournament(@Body(new ValidationPipe()) PlayerData: newPlayer) {
        return this.playerService.createPlayer(PlayerData)
    }
    @Put(':id')
    async updateTournament(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: Partial<newPlayer>) {
        this.playerService.updatePlayerData(id, updateData)
    }
    async deletePlayer(@Param('id') id: string) {
        this.playerService.deletePlayer(id)
    }
}
