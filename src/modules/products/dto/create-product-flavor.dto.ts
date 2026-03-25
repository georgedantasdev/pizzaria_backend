import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductFlavorDto {
  @ApiProperty({ example: 'Borda Recheada' })
  @IsString()
  @MinLength(1)
  name: string;
}