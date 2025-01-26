import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), UserModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
