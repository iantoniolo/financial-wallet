import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestLoginDto } from './dto/request-login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter token' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso, token retornado.',
    type: ResponseLoginDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
  })
  async login(
    @Body() requestLoginDto: RequestLoginDto,
  ): Promise<ResponseLoginDto> {
    return await this.authService.login(requestLoginDto);
  }
}
