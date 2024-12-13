/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FormatMatchesData, poolMatchInterface, teamsInterface } from "../dtos/tournaments.dto";
@Schema({
    timestamps: true,
})
export class TournamentProperties {
    @Prop({ required: true, unique: true })
    name: string;
    @Prop({maxlength:10000})
    description: string;
    @Prop({ required: true })
    sport: string;
    @Prop({ required: true })
    teams: teamsInterface[]
    @Prop()
    pools?: number | null
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
    @Prop({ type: [Object] })  // This will store matches as an array of objects
    poolMatches?: poolMatchInterface[] | null;
    @Prop()
    formatMatches: FormatMatchesData[] | null
    @Prop()
    poolScheduledMatches: FormatMatchesData[] | null

}
export const TournamentSchema = SchemaFactory.createForClass(TournamentProperties)
TournamentSchema.index({ name: 1 }, { unique: true })
