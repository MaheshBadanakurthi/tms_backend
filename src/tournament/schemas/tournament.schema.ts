/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({
    timestamps: true,
})
export class TournamentProperties {
    @Prop({ required: true, unique: true })
    name: string;
    @Prop({ required: true })
    sport: string;
    @Prop({ required: true })
    teams: string[]
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
