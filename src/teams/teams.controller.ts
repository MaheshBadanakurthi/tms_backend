/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { NewTeam } from './dtos/teams.dto';

@Controller('teams')
export class TeamsController {
    constructor(private teamService: TeamsService) { }
    @Get()
    async getAllTeams() {
        return this.teamService.getAllTeams()
    }
    @Post()
    async createNewTeam(@Body(new ValidationPipe()) teamData: NewTeam) {
        return this.teamService.createTeam(teamData)
    }
    @Put(':id')
    async updateTeam(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updateData: Partial<NewTeam>) {
        this.teamService.updateTeam(id, updateData)
    }
    @Delete(':id')
    async deleteTeam(@Param('id') id: string) {
        this.teamService.deleteTeam(id)
    }
}
