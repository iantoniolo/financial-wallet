import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './users.service';
import { RequestUserDto } from './dto/request-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminOrRequestUserParamGuard } from 'src/auth/guards/admin-or-param-user.guard';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação. Dados fornecidos são inválidos.',
  })
  async create(@Body() createUserDto: RequestUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários.',
    type: [ResponseUserDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token de autenticação inválido ou ausente.',
  })
  async findAll(@CurrentUser() user: UserEntity): Promise<ResponseUserDto[]> {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminOrRequestUserParamGuard)
  @ApiOperation({ summary: 'Recuperar um usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminOrRequestUserParamGuard)
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() responseUserDto: ResponseUserDto,
  ) {
    return this.usersService.update(+id, responseUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminOrRequestUserParamGuard)
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
