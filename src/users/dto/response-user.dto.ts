import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: 1000.55 })
  balance: number;

  @ApiProperty({ example: false })
  isAdmin: boolean;
}
