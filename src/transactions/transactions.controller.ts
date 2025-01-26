import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseTransactionDto } from './dto/response-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminOrRequestUserBodyGuard } from 'src/auth/guards/admin-or-body-user.guard';
import { AdminOrSenderTransactionGuard } from 'src/auth/guards/admin-or-sender-transaction.guard';
import { AdminOrParticipantTransactionGuard } from 'src/auth/guards/admin-or-participant-transaction.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminOrRequestUserBodyGuard)
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
    type: ResponseTransactionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação. Dados fornecidos são inválidos.',
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações.',
    type: [ResponseTransactionDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token de autenticação inválido ou ausente.',
  })
  async findAll(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseTransactionDto[]> {
    const transactions = await this.transactionService.findAll(user);
    return transactions.map((transaction) => ({
      id: transaction.id,
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminOrParticipantTransactionGuard)
  @ApiOperation({ summary: 'Recuperar uma transação por ID' })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada.',
    type: ResponseTransactionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada.',
  })
  async findOne(@Param('id') id: number): Promise<ResponseTransactionDto> {
    const transaction = await this.transactionService.findOne(id);
    return {
      id: transaction.id,
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  @Patch('/reverse/:id')
  @UseGuards(JwtAuthGuard, AdminOrSenderTransactionGuard)
  @ApiOperation({ summary: 'Reverter uma transação' })
  @ApiResponse({
    status: 200,
    description: 'Transação revertida com sucesso.',
    type: ResponseTransactionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Erro ao reverter a transação. Verifique o estado da transação.',
  })
  async reverseTransaction(
    @Param('id') id: number,
  ): Promise<TransactionEntity> {
    return this.transactionService.reverseTransaction(id);
  }
}
