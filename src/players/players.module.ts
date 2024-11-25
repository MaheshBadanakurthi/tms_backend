/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';
import { playerSchema } from './schemas/players.schema';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports:[
    MongooseModule.forFeature([{name:'player',schema:playerSchema}])
  ]
})
export class PlayersModule {}
