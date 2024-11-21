import { PartialType } from '@nestjs/mapped-types';
import { newTournament } from './tournaments.dto';

export class UpdateTournamentDto extends PartialType(newTournament) {}