import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Transaction } from '@prisma/client';

@Injectable()
export class TransactionsRepository  {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({ 
      data,
    });
  }

  async update(id: number, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}