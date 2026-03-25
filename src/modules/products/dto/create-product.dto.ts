import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsOptional,
    IsString,
    IsUrl,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { CreateProductFlavorDto } from './create-product-flavor.dto';
import { CreateProductSizeDto } from './create-product-size.dto';

export class CreateProductDto {
  @ApiProperty({ example: 'Pizza Margherita' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'Molho de tomate, mussarela e manjericão' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/imagem.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    type: [CreateProductSizeDto],
    example: [
      { name: 'Pequena', price: '25.90' },
      { name: 'Grande', price: '45.90' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductSizeDto)
  sizes: CreateProductSizeDto[];

  @ApiProperty({
    type: [CreateProductFlavorDto],
    example: [{ name: 'Tradicional' }, { name: 'Borda Recheada' }],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductFlavorDto)
  flavors: CreateProductFlavorDto[];
}
