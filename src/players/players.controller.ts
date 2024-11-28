/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { PlayersService } from './players.service';
import { newPlayer } from './dtos/players.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';

@Controller('players')
export class PlayersController {

    constructor(private playerService: PlayersService) { }
    @Get()
    async getAllPlayers() {
        return this.playerService.getAllPlayers()
    }
    @Post()
    async createNewTournament(@Body(new ValidationPipe()) PlayerData: newPlayer) {
        return this.playerService.createPlayer(PlayerData)
    }
    @Put(':id')
    async updateTournament(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: UpdatePlayerDto) {
        try {
            const result = await this.playerService.updatePlayerData(id, updateData)
            return result;
        } catch (error) {
            throw error
        }

    }
    @Delete(':id')
    async deletePlayer(@Param('id') id: string) {
        this.playerService.deletePlayer(id)
    }
}
