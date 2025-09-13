import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionType } from '@prisma/client';

export class TransactionsService  {
  constructor(private prisma: PrismaService) {}

  async deposit(senderId: number, dto: DepositDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== senderId)
      throw new ForbiddenException('You can only deposit to your own account');

    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { balance: { increment: dto.amount } },
    });

    return this.prisma.transaction.create({
      data: {
        senderId,
        accountId: dto.accountId,
        type: TransactionType.DEPOSIT,
        amount: dto.amount,
      },
    });
  }

  async withdraw(senderId: number, dto: WithdrawDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== senderId)
      throw new ForbiddenException('You can only withdraw from your own account');

    if (account.balance < dto.amount)
      throw new BadRequestException('Insufficient balance');

    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { balance: { decrement: dto.amount } },
    });

    return this.prisma.transaction.create({
      data: {
        senderId,
        accountId: dto.accountId,
        type: TransactionType.WITHDRAW,
        amount: dto.amount,
      },
    });
  }

  async transfer(senderId: number, dto: TransferDto) {
    const {
      receiverId,
      accountId,
      amount,
      description,
    } = dto;

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });
    if (!sender) throw new NotFoundException('Sender not found');

    const senderAccount = await this.prisma.account.findFirst({
      where: { id: accountId, userId: senderId },
    });
    if (!senderAccount)
      throw new ForbiddenException('You can only transfer from your own account');

    if (senderAccount.balance < amount)
      throw new BadRequestException('Insufficient balance');

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const receiverAccount = await this.prisma.account.findFirst({
      where: { userId: receiverId },
    });
    if (!receiverAccount)
      throw new NotFoundException('Receiver account not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: senderAccount.id },
        data: { balance: { decrement: amount } },
      });

      await tx.account.update({
        where: { id: receiverAccount.id },
        data: { balance: { increment: amount } },
      });

      return tx.transaction.create({
        data: {
          accountId: senderAccount.id,
          senderId,
          receiverId,
          type: TransactionType.TRANSFER,
          amount,    
          description,
        },
      });
    });
  }

  async getAllByUser(userId: number, role: string) {
    if (role === 'admin') {
      return this.prisma.transaction.findMany();
    }

    return this.prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
  }

  async getTransactionById(id: number, userId: number, role: string) {
    const trx = await this.prisma.transaction.findUnique({ where: { id } });
    if (!trx) throw new NotFoundException('Transaction not found');

    if (role !== 'admin' && trx.senderId !== userId && trx.receiverId !== userId) {
      throw new ForbiddenException('You are not authorized to view this transaction');
    }

    return trx;
  }
} 