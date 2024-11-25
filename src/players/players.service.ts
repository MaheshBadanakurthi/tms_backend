/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Players } from './schemas/players.schema';
import { newPlayer } from './dtos/players.dto';

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel('player')
        private readonly allPlayersModel: Model<Players>
    ) { }
    //get all players
    async getAllPlayers(): Promise<Players[]> {
        try {
            const players = await this.allPlayersModel.find().sort({ createdAt: -1 }).exec();
            if (!players || players.length === 0) {
                throw new NotFoundException('No players found')
            }
            return players
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error while fetching the players data')
        }
    }
    //creating a player
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
    //updating a player
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
    //deleting the player
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
