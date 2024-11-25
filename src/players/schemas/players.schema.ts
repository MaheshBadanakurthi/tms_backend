/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Players {
    @Prop({required:true})
    name: string;
    @Prop({required:true})
    age: number;
    @Prop({required:true})
    sport: string[];
    @Prop()
    teams: string[];
    @Prop({required:true})
    profilePicture: string;
}
export const playerSchema = SchemaFactory.createForClass(Players)