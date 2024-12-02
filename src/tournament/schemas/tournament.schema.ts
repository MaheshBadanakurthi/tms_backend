/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { teamsInterface } from "../dtos/tournaments.dto";
@Schema({
    timestamps: true,
})
export class TournamentProperties {
    @Prop({ required: true, unique: true })
    name: string;
    @Prop()
    description:string;
    @Prop({ required: true })
    sport: string;
    @Prop({ required: true })
    teams: teamsInterface[]
    @Prop()
    pools?: number
    @Prop()
    format?: string
    @Prop()
    profile: string | null
    @Prop()
    startDate?: Date
    @Prop()
    endDate?: Date
    @Prop()
    maxTeams?: number
    @Prop({ default: Date.now })
    createdAt: Date
}
export const TournamentSchema = SchemaFactory.createForClass(TournamentProperties)
TournamentSchema.index({name:1},{unique:true})
