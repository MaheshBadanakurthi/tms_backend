import { IsOptional, IsInt, IsPositive, IsBoolean } from "class-validator";
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;
  @IsOptional()
  @IsBoolean()
  showAll: boolean
}