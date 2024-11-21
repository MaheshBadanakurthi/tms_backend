import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TournamentSchema } from './schemas/tournament.schema';

@Module({
  providers: [TournamentService],
  controllers: [TournamentController],
  imports:[
    MongooseModule.forFeature([{name:'TournamentProperties',schema:TournamentSchema}])
  ]
})
export class TournamentModule {}
