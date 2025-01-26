import { IsNotEmpty, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  senderId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  receiverId: number;

  @ApiProperty({ example: 100.5 })
  @IsPositive()
  @IsNumber()
  amount: number;
}
