/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Teams {
    @Prop({ required: true, unique: true })
    teamName: string;
    @Prop({ required: true })
    sport: string;
    @Prop()
    players: { id: string, name: string }[];
    @Prop({ required: true })
    profile: string
}
export const teamsSchema = SchemaFactory.createForClass(Teams)
