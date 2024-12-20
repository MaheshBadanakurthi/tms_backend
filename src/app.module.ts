/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { TournamentModule } from './tournament/tournament.module';
import { PlayersModule } from './players/players.module';
import { ProfileModule } from './Profile/profile.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app without re-importing
      envFilePath: `../.env`, // Specifies the path to the .env file (default is '.env')
    }),
    MongooseModule.forRoot('mongodb+srv://maheshbadanakurthi:wQ8TrHZfubO9kViI@tmscluster.e6tmm.mongodb.net/?retryWrites=true&w=majority&appName=tmsCluster/test'),
    TournamentModule,
    PlayersModule,
    TeamsModule,
    ProfileModule,
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor() { }
  async onModuleInit() {
    try {
      await mongoose.connect('mongodb+srv://maheshbadanakurthi:wQ8TrHZfubO9kViI@tmscluster.e6tmm.mongodb.net/?retryWrites=true&w=majority&appName=tmsCluster/test');
      console.log('DB Connected Successfully!');
    } catch (err) {
      console.error('MongoDB connection failed:', err);
    }
  }
}
