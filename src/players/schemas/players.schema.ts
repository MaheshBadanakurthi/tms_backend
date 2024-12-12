/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Players {
    @Prop({ required: true })
    playerName: string;
    @Prop({ required: true })
    age: string;
    @Prop({ required: true })
    sport: string[];
    @Prop()
    profile?: string;
}
export const playerSchema = SchemaFactory.createForClass(Players)