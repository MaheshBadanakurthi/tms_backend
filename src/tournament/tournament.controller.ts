/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { newTournament } from './dtos/tournaments.dto';
import { TournamentService } from './tournament.service';
import { UpdateTournamentDto } from './dtos/updateTournament.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@ApiTags("Tournament")
@Controller('tournament')
export class TournamentController {
    constructor(private tourService: TournamentService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get(':id?')
    @ApiOperation({ summary: 'Get all tournaments and Get tournament by ID', description: 'Without ID, it will fetch All Tournaments, with ID, it will fetch a tournament by ID.' })
    @ApiResponse({ status: 200, description: "Tournament fetched successfully" })
    @ApiResponse({ status: 500, description: "Internal error" })
    @ApiParam({ name: 'id', required: false, description: "ID to fetch tournament by id", type: String })
    async getAllTournaments(@Query() paginationQuery: PaginationDto, @Param('id') id: string) {
        return this.tourService.getAllTournaments(paginationQuery, id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post()
    @ApiOperation({ summary: 'Create new Tournament' })
    @ApiBody({ type: newTournament, description: 'Payload for creating new tournament' })
    @ApiResponse({ status: 200, description: "Tournament created successfully" })
    @ApiResponse({ status: 400, description: "Bad request check payload" })
    @ApiResponse({ status: 500, description: "Internal error" })
    async createNewTournament(@Body(new ValidationPipe()) tournamentData: newTournament) {
        return this.tourService.createTournament(tournamentData)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
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
