/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TournamentProperties } from './schemas/tournament.schema';
import { newTournament } from './dtos/tournaments.dto';
import { PaginationDto } from 'src/pagination.dto';
import { MatcheService } from './services/matches.service';


@Injectable()
export class TournamentService {
    constructor(
        @InjectModel(TournamentProperties.name)
        private readonly tournamentModel: Model<TournamentProperties>,
        private matcheService: MatcheService
    ) { }
    // Get All tournaments
    async getAllTournaments(paginationQuery: PaginationDto, id: string): Promise<{ data: TournamentProperties[]; total?: number }> {
        try {
            const { page = 0, limit = 10 } = paginationQuery;
            if (id) {
                // Use findById for a specific tournament
                const singleTournament = await this.tournamentModel.findById(id);

                if (!singleTournament) {
                    throw new NotFoundException(`Tournament with ID ${id} not found`);
                }

                return { data: [singleTournament] };
            }
            const [tournaments, total] = await Promise.all([
                this.tournamentModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(page * limit)
                    .limit(limit)
                    .exec(),
                this.tournamentModel.countDocuments().exec(),
            ]);

            return { data: tournaments, total: total };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error);
        }
    }
    // New Tournament creation with error handling  
    async createTournament(tournamentData: newTournament): Promise<{ message: string; data?: TournamentProperties }> {
        try {
            if (tournamentData.maxTeams && tournamentData.teams.length > tournamentData.maxTeams) {
                throw new BadRequestException('Number of teams can not more than max teams.');
            }

            const newTournament = new this.tournamentModel({
                ...tournamentData,
                createdAt: new Date(),
            });
            let matches = [];
            if (newTournament.pools) {
                matches = this.matcheService.scheduleMatchesByPool(newTournament.teams, newTournament.pools)
                newTournament.format = null;
                newTournament.poolMatches = matches

            } else if (newTournament.format) {
                matches = this.matcheService.scheduleMatchesBasedOnFormat(newTournament.teams, newTournament.format)
                newTournament.pools = null;
                newTournament.formatMatches = matches
            }
            const savedTournament = await newTournament.save();
            return {
                message: 'Tournament created successfully',
                data: savedTournament,
            };
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Tournament with this name already exists.');
            }
            throw new InternalServerErrorException(error);
        }
    }
    // Update tournament data
    async updateTournamentData(id: string, updateData: Partial<newTournament>): Promise<{ message: string, data: TournamentProperties }> {
        try {
            // First, check if the tournament exists
            const existingTournament = await this.tournamentModel.findById(id);
            if (!existingTournament) {
                throw new NotFoundException('Tournament not found');
            }
            // Additional validation if needed (e.g., team count)
            if (updateData.maxTeams && updateData.teams && updateData.teams.length > updateData.maxTeams) {
                throw new BadRequestException('Number of teams exceeds maximum team limit');
            }
            // Update the tournament
            const updatedTournament = await this.tournamentModel
                .findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    {
                        new: true, // Return the updated document
                        runValidators: true // Run model validations during update
                    }
                )
                .exec();

            if (!updatedTournament) {
                throw new InternalServerErrorException('Failed to update tournament');
            }

            return {
                message: 'Tournament updated successfully',
                data: updatedTournament
            };
        } catch (error) {
            // More specific error handling
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error.code === 11000) {
                throw new ConflictException('Tournament with this name already exists');
            }
            console.error('Update tournament error:', error);
            throw new InternalServerErrorException('Error updating tournament');
        }
    }
    async deleteTournament(id: string): Promise<{ message: string }> {
        try {
            const existingTournament = this.tournamentModel.findById(id)
            if (!existingTournament) throw new NotFoundException('Tournament not found')
            await this.tournamentModel.findByIdAndDelete(id)
            return { message: 'Tournament deleted successfully.' }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Error in deleting tournament')
        }
    }
}
