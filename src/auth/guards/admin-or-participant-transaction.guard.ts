import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';

@Injectable()
export class AdminOrParticipantTransactionGuard implements CanActivate {
  constructor(private readonly transactionService: TransactionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const transactionId = request.params.id;

    const transaction = await this.transactionService.findOne(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (
      user.isAdmin ||
      user.id === transaction.senderId ||
      user.id === transaction.receiverId
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não possui permissão para acessar este recurso',
    );
  }
}
