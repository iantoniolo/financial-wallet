import { ApiProperty } from '@nestjs/swagger';

export class ResponseLoginDto {
  @ApiProperty({
    description: 'Token JWT gerado para autenticação.',
  })
  accessToken: string;
}
