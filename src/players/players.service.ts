/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Players } from './schemas/players.schema';
import { newPlayer } from './dtos/players.dto';
import { PaginationDto } from 'src/pagination.dto';
@Injectable()
export class PlayersService {
    constructor(
        @InjectModel('player')
        private readonly allPlayersModel: Model<Players>
    ) { }
    async getAllPlayers(paginationQuery: PaginationDto): Promise<{ data: Players[]; total: number }> {
        // const { page = 0, limit = 10 } = paginationQuery;
        const page = Number(paginationQuery.page) || 1;
        const limit = Number(paginationQuery.limit) || 10;
        try {
            const [players, total] = await Promise.all([
                this.allPlayersModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(page)
                    .limit(limit)
                    .exec(),
                this.allPlayersModel.countDocuments().exec(),
            ]);
            return { data: players, total };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error while fetching the players data')
        }
    }
    async createPlayer(playersData: newPlayer): Promise<{ message: string; data?: Players }> {
        try {
            const newPlayer = new this.allPlayersModel({
                ...playersData, createdAt: new Date(),
            });
            const savedPlayer = await newPlayer.save();
            return {
                message: 'Tournament created succesfully',
                data: savedPlayer,
            }
        }
        catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('An error occurred while creating the tournament.');
        }
    }
    async updatePlayerData(id: string, updateData: Partial<newPlayer>): Promise<{ message: string, data: Players }> {
        try {
            const existingPlayer = this.allPlayersModel.findById(id)
            if (!existingPlayer) throw new NotFoundException("Player not NotFound.")
            const updatedPlayer = await this.allPlayersModel.findByIdAndUpdate(id, {
                $set: updateData
            }, { new: true }).exec();
            return { message: 'Player updated successfully', data: updatedPlayer }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Error updating tournament');
        }
    }
    async deletePlayer(id: string): Promise<{ message: string }> {
        try {
            const existingPlayer = this.allPlayersModel.findById(id)
            if (!existingPlayer) throw new NotFoundException('Player not found.')
            await this.allPlayersModel.findByIdAndDelete(id)
            return { message: 'Player deleted successfully.' }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Error in deleting player.')
        }
    }
}
