/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})
export class TournamentProperties {
    @Prop({required:true,unique:true})
    name: string;

    @Prop({required:true})
    sport: string;

    @Prop({required:true})
    teams: string[]

    @Prop()
    pools?: number

    @Prop()
    format?: string

    @Prop({default:Date.now})
    createdAt:Date
}
export const TournamentSchema  = SchemaFactory.createForClass(TournamentProperties)
