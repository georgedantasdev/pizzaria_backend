import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'George Dantas' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'george@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}