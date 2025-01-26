import { ApiProperty } from '@nestjs/swagger';

export class RequestLoginDto {
  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @ApiProperty({ example: 'pass123' })
  password: string;
}
