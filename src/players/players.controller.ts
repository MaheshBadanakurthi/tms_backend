/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { PlayersService } from './players.service';
import { newPlayer } from './dtos/players.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('player')
export class PlayersController {
    constructor(private playerService: PlayersService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get()
    @ApiOperation({ summary: 'Get all players' })
    @ApiResponse({ status: 200, description: "Players fetched successfully" })
    async getAllPlayers(@Query() paginationQuery: PaginationDto) {
        return this.playerService.getAllPlayers(paginationQuery)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post()
    @ApiOperation({ summary: 'Create new player' })
    @ApiBody({ type: newPlayer, description: 'Payload for creating new player' })
    @ApiResponse({ status: 200, description: "player created successfully" })
    async createNewTournament(@Body(new ValidationPipe()) PlayerData: newPlayer) {
        return this.playerService.createPlayer(PlayerData)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Put(':id')
    @ApiOperation({
        summary: "Update player based on Id" 
    })
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    @ApiOperation({
        summary: "Delete player based on Id" 
    })
    async deletePlayer(@Param('id') id: string) {
        try {
            this.playerService.deletePlayer(id)
        } catch (error) { throw error }
    }
}
