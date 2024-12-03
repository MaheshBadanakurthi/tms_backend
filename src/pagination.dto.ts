import { IsOptional, IsInt, IsPositive } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;
}