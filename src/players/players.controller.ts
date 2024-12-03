/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { PlayersService } from './players.service';
import { newPlayer } from './dtos/players.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination.dto';
@Controller('players')
export class PlayersController {

    constructor(private playerService: PlayersService) { }
    @Get()
    @ApiOperation({
        summary: 'Get all players'
    })
    @ApiResponse({
        status: 200,
        description: "Players fetched successfully"
    })
    async getAllPlayers(@Query() paginationQuery: PaginationDto) {
        return this.playerService.getAllPlayers(paginationQuery)
    }
    @Post()
    @ApiOperation({
        summary: 'Create new player'
    })
    @ApiBody({ type: newPlayer, description: 'Payload for creating new player' })
    @ApiResponse({ status: 200, description: "player created successfully" })

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
