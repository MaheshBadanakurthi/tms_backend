/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { teamsSchema } from './schemas/teams.schema';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports:[
    MongooseModule.forFeature([{name:'Teams',schema:teamsSchema}])
  ]
})
export class TeamsModule {}
