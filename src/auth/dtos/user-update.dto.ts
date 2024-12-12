import { PartialType } from "@nestjs/swagger";
import { registerDataTypes } from "./auth.dto";

export class UpdateUserDto extends PartialType(registerDataTypes){}