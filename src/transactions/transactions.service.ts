import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  TransactionEntity,
  TransactionStatus,
} from './entities/transaction.entity';
import { UserService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  private async updateUserBalance(
    queryRunner: any,
    userId: number,
    newBalance: number,
  ): Promise<void> {
    await queryRunner.manager.update('UserEntity', userId, {
      balance: newBalance,
    });
  }

  private async findUserById(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async createTransactionRecord(
    senderId: number,
    receiverId: number,
    amount: number,
  ): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create({
      senderId,
      receiverId,
      amount,
      status: TransactionStatus.PENDING,
    });
    return transaction;
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const { senderId, receiverId, amount } = createTransactionDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await this.findUserById(senderId);
      const receiver = await this.findUserById(receiverId);

      if (sender.balance < amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const transaction = await this.createTransactionRecord(
        senderId,
        receiverId,
        amount,
      );

      const savedTransaction = await queryRunner.manager.save(transaction);

      sender.balance -= amount;
      receiver.balance += amount;

      await this.updateUserBalance(queryRunner, senderId, sender.balance);
      await this.updateUserBalance(queryRunner, receiverId, receiver.balance);

      savedTransaction.status = TransactionStatus.COMPLETED;
      await queryRunner.manager.save(savedTransaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async reverseTransaction(transactionId: number): Promise<TransactionEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(TransactionEntity, {
        where: { id: transactionId },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (transaction.status === TransactionStatus.REVERSED) {
        throw new BadRequestException('Transaction already reversed');
      }

      const sender = await this.findUserById(transaction.senderId);
      const receiver = await this.findUserById(transaction.receiverId);

      const senderBalance = parseFloat(sender.balance as any);
      const receiverBalance = parseFloat(receiver.balance as any);
      const transactionAmount = parseFloat(transaction.amount as any);

      if (
        isNaN(senderBalance) ||
        isNaN(receiverBalance) ||
        isNaN(transactionAmount)
      ) {
        throw new InternalServerErrorException(
          'Invalid numeric value encountered',
        );
      }

      sender.balance = senderBalance + transactionAmount;
      receiver.balance = receiverBalance - transactionAmount;

      await this.updateUserBalance(
        queryRunner,
        transaction.senderId,
        sender.balance,
      );
      await this.updateUserBalance(
        queryRunner,
        transaction.receiverId,
        receiver.balance,
      );

      transaction.status = TransactionStatus.REVERSED;
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(currentUser: UserEntity): Promise<TransactionEntity[]> {
    return currentUser.isAdmin
      ? await this.transactionRepository.find()
      : await this.transactionRepository.find({
          where: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
        });
  }

  async findByUserId(userId: number): Promise<TransactionEntity[]> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .where(
        'transaction.senderId = :userId OR transaction.receiverId = :userId',
        { userId },
      )
      .getMany();
  }

  async findOne(id: number): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
