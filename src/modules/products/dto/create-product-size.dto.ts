import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsString, MinLength } from 'class-validator';

export class CreateProductSizeDto {
  @ApiProperty({ example: 'Grande' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: '45.90' })
  @IsDecimal({ decimal_digits: '0,2' })
  price: string;
}
