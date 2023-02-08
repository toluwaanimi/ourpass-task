import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginateDTO {
  @IsOptional()
  @ApiPropertyOptional()
  page: number;

  @IsOptional()
  @ApiPropertyOptional()
  per_page: number;
}
