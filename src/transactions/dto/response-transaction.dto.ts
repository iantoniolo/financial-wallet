import { ApiProperty } from '@nestjs/swagger';

export class ResponseTransactionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  senderId: number;

  @ApiProperty({ example: 2 })
  receiverId: number;

  @ApiProperty({ example: 100.5 })
  amount: number;

  @ApiProperty({ example: 'Completed' })
  status: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T15:00:00Z' })
  updatedAt: Date;
}
