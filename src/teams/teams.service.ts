/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teams } from './schemas/teams.schema';
import { Model } from 'mongoose';
import { NewTeam } from './dtos/teams.dto';
import { PaginationDto } from 'src/pagination.dto';
@Injectable()
export class TeamsService {

    constructor(
        @InjectModel('Teams')
        private readonly teamModel: Model<Teams>,
    ) { }
    async getAllTeams(paginationQuery: PaginationDto): Promise<{ data: Teams[]; total: number }> {
        const { page = 0, limit = 10 } = paginationQuery;
        try {
          const [teams, total] = await Promise.all([
            this.teamModel
              .find()
              .sort({ createdAt: -1 })
              .skip(page)
              .limit(limit)
              .exec(),
            this.teamModel.countDocuments().exec(),
          ]);
          return { data: teams, total };
        } catch (error) {
          throw new InternalServerErrorException('Error fetching teams');
        }
      }
    async createTeam(tournamentData: NewTeam): Promise<{ message: string; data?: Teams }> {
        console.log(tournamentData);
        try {
            const newTeam = new this.teamModel({
                ...tournamentData,
                createdAt: new Date(),
            });
            const savedTeam = await newTeam.save();
            return {
                message: 'Team created successfully',
                data: savedTeam,
            };
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Team with this name already exists.');
            }
            throw new InternalServerErrorException('An error occurred while creating the team.');
        }
    }
    async updateTeam(id: string, updateData: Partial<NewTeam>): Promise<{ message: string, data: Teams }> {
        try {
            const existingTeam = this.teamModel.findById(id)
            if (!existingTeam) throw new NotFoundException('Team not found')
            const updatedTeam = await this.teamModel
                .findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    { new: true }
                )
                .exec();
            return { message: 'Team updated successfully', data: updatedTeam }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            if (error.code === 1100) throw new ConflictException('Team with this name already exists')
            throw new InternalServerErrorException('Error updating team');
        }
    }
    async deleteTeam(id: string): Promise<{ message: string }> {
        try {
            const existingTeam = this.teamModel.findById(id)
            if (!existingTeam) throw new NotFoundException('Team not found')
            await this.teamModel.findByIdAndDelete(id)
            return { message: 'Team deleted successfully.' }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Error in deleting team')
        }
    }
}
