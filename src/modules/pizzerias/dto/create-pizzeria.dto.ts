import { IsString, MinLength, Length, IsEmail, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'joao@pizzadojoao.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreatePizzeriaDto {
  @ApiProperty({ example: 'Pizzaria do João' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: '12345678000195' })
  @IsString()
  @Length(14, 14)
  document: string;

  @ApiProperty({ type: CreateAdminDto })
  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
}
