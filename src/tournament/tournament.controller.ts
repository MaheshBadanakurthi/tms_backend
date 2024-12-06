/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { newTournament } from './dtos/tournaments.dto';
import { TournamentService } from './tournament.service';
import { UpdateTournamentDto } from './dtos/updateTournament.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination.dto';
@ApiTags("Tournaments")
@Controller('tournaments')
export class TournamentController {
    constructor(private tourService: TournamentService) { }
    @Get(':id?')
    @ApiOperation({ summary: 'Get all tournaments' })
    @ApiResponse({ status: 200, description: "Tournament fetched successfully" })
    @ApiResponse({ status: 500, description: "Internal error" })
    async getAllTournaments(@Query() paginationQuery: PaginationDto, @Param('id') id: string) {
        return this.tourService.getAllTournaments(paginationQuery, id)
    }
    @Post()
    @ApiOperation({ summary: 'Create new Tournament' })
    @ApiBody({ type: newTournament, description: 'Payload for creating new tournament' })
    @ApiResponse({ status: 200, description: "Tournament created successfully" })
    @ApiResponse({ status: 400, description: "Bad request check payload" })
    @ApiResponse({ status: 500, description: "Internal error" })
    async createNewTournament(@Body(new ValidationPipe()) tournamentData: newTournament) {
        return this.tourService.createTournament(tournamentData)
    }
    @Put(':id')
    @ApiOperation({ summary: "Update tournament based on Id" })
    @ApiBody({ type: newTournament, description: "Update tournament data", })
    @ApiResponse({ status: 200, description: "Tournament updated successfully" })
    @ApiResponse({ status: 400, description: "Bad request check payload" })
    @ApiResponse({ status: 500, description: "Internal error" })
    async updateTournament(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: UpdateTournamentDto) {
        try {
            const result = await this.tourService.updateTournamentData(id, updateData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Delete Tournament
    @Delete(':id')
    @ApiOperation({ summary: "Delete tournament based on id" })
    @ApiResponse({ status: 200, description: "Tournament delete successfully" })
    @ApiResponse({ status: 400, description: "Bad request check payload" })
    @ApiResponse({ status: 500, description: "Internal error" })
    async deleteTournament(@Param('id') id: string) {
        try {
            const result = await this.tourService.deleteTournament(id)
            return result
        } catch (error) { }
    }

}
