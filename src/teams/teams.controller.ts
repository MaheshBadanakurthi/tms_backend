/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { NewTeam } from './dtos/teams.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('team')
export class TeamsController {
    constructor(private teamService: TeamsService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get()
    @ApiOperation({
        summary: 'Get all teams'
    })
    @ApiResponse({
        status: 200,
        description: "Teams fetched successfully"
    })
    @Get()
    async getAllTeams(@Query() paginationQuery: PaginationDto) {
        return this.teamService.getAllTeams(paginationQuery);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post()
    @ApiOperation({
        summary: 'Create new Team'
    })
    @ApiBody({ type: NewTeam, description: 'Payload for creating new Team' })
    async createNewTeam(@Body(new ValidationPipe()) teamData: NewTeam) {
        return this.teamService.createTeam(teamData)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Put(':id')
    async updateTeam(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: Partial<NewTeam>) {
        this.teamService.updateTeam(id, updateData)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    async deleteTeam(@Param('id') id: string) {
        this.teamService.deleteTeam(id)
    }
}
