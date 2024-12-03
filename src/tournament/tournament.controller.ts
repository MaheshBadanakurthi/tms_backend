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
    @Get()
    @ApiOperation({
        summary: 'Get all tournaments'
    })
    @ApiResponse({
        status: 200,
        description: "Tournament fetched successfully"
    })
    async getAllTournaments(@Query() paginationQuery: PaginationDto) {
        return this.tourService.getAllTournaments(paginationQuery)
    }

    @Post()
    @ApiOperation({
        summary: 'Create new Tournament'
    })
    @ApiBody({ type: newTournament, description: 'Payload for creating new tournament' })
    @ApiResponse({ status: 200, description: "Tournament created successfully" })
    async createNewTournament(@Body(new ValidationPipe()) tournamentData: newTournament) {
        return this.tourService.createTournament(tournamentData)
    }

    @Put(':id')
    async updateTournament(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: UpdateTournamentDto) {
        console.log('Received ID:', id);
        console.log('Update Data:', updateData);

        try {
            const result = await this.tourService.updateTournamentData(id, updateData);
            console.log('Update Result:', result);
            return result;
        } catch (error) {
            console.error('Update Error:', error);
            throw error;
        }
    }

    // Delete Tournament
    @Delete(':id')
    async deleteTournament(@Param('id') id: string) {
        try {
            const result = await this.tourService.deleteTournament(id)
            return result
        } catch (error) {

        }
    }

}
