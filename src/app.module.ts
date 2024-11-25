import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { TournamentModule } from './tournament/tournament.module';
import { TournamentService } from './tournament/tournament.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app without re-importing
      envFilePath: `.env`, // Specifies the path to the .env file (default is '.env')
    }),
    MongooseModule.forRoot('mongodb+srv://maheshbadanakurthi:wQ8TrHZfubO9kViI@tmscluster.e6tmm.mongodb.net/?retryWrites=true&w=majority&appName=tmsCluster/test'),
    TournamentModule,
    PlayersModule,
    TeamsModule

  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor() { }
  onModuleInit() {
    
    // Check connection using a promise after initialization
    mongoose.connect('mongodb+srv://maheshbadanakurthi:wQ8TrHZfubO9kViI@tmscluster.e6tmm.mongodb.net/?retryWrites=true&w=majority&appName=tmsCluster/test')
      .then(() => {
        console.log('MongoDB connection successful!');
      })
      .catch((err) => {
        console.error('MongoDB connection failed:', err);
      });
  }

}
