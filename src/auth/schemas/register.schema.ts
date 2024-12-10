import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Register {
    @Prop()
    name: string;
    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;
    @Prop()
    password: string;
    @Prop()
    mobile: number
    @Prop({ default: 'User' }) // Default role is 'User'
    role: string;
}
export const RegisterSchema = SchemaFactory.createForClass(Register)