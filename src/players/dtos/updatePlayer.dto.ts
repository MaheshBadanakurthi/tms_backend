/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { newPlayer } from "./players.dto";

export class UpdatePlayerDto  extends PartialType(newPlayer) {}