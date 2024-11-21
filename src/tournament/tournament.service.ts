import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TournamentProperties } from './schemas/tournament.schema';
import { newTournament } from './dtos/tournaments.dto';

@Injectable()
export class TournamentService {
    constructor(
        @InjectModel('TournamentProperties')
        private readonly tournamentModel: Model<TournamentProperties>,
    ) { }

    // Get All tournaments
    async getAllTournaments(): Promise<TournamentProperties[]> {
        try {
            const tournaments = await this.tournamentModel
                .find()
                .sort({ createdAt: -1 })
                .exec();
            if (!tournaments || tournaments.length === 0) {
                throw new NotFoundException('No tournaments found');
            }

            return tournaments;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error fetching tournaments');
        }
    }

    // New Tournament creation with error handling
    async createTournament(tournamentData: newTournament): Promise<{ message: string; data?: TournamentProperties }> {
        console.log(tournamentData);

        try {
            const newTournament = new this.tournamentModel({
                ...tournamentData,
                createdAt: new Date(),
            });
            console.log(newTournament);
            const savedTournament = await newTournament.save();

            return {
                message: 'Tournament created successfully',
                data: savedTournament,
            };
        } catch (error) {
            // Handle duplicate name error (MongoDB unique index error code)
            if (error.code === 11000) {
                throw new BadRequestException('Tournament with this name already exists.');
            }

            // Generic error
            throw new InternalServerErrorException('An error occurred while creating the tournament.');
        }
    }
    // Update tournament data
    async updateTournamentData(id: string, updateData: Partial<newTournament>): Promise<{ message: string, data: TournamentProperties }> {
        try {
            const existingTournament = this.tournamentModel.findById(id)
            if (!existingTournament) throw new NotFoundException('Tournament not found')
            // Update the tournament
            const updatedTournament = await this.tournamentModel
                .findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    { new: true } // This option returns the updated document
                )
                .exec();
            return { message: 'Tournament updated successfully', data: updatedTournament }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            if (error.code === 1100) throw new ConflictException('Tournament with this name already exists')
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
