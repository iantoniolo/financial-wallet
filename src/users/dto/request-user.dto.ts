import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUserDto {
  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pass123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1000.55 })
  @IsNumber()
  balance: number;

  @ApiProperty({ example: false })
  @IsBoolean({
    message: 'isAdmin must be a boolean value (true or false)',
  })
  isAdmin: boolean;
}
