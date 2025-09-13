import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account, PrismaClient } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateAccountDto } from '../dto/update-account.dto';  

@Injectable()
export class AccountsRepository {
  constructor(private prisma: PrismaService) {}

  
 async createAccount(data: CreateAccountDto & { userId: number }): Promise<Account> {
    try {
      return await this.prisma.account.create({ 
        data: {
          balance: data.balance,
          name: data.name,
          userId: data.userId,
        }, 
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAccountById(id: number): Promise<Account | null> {
    try {
      const account = await this.prisma.account.findUnique({
        where: { id },
      });

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      return account;
    } catch (error) {
      throw new HttpException('Failed to get account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

async getAccountByUserId(userId: number): Promise<Account | null> {
    return this.prisma.account.findFirst({ where: { userId } });
  }

  async getAllAccounts(): Promise<Account[]> {
    try {
      return await this.prisma.account.findMany();
    } catch (error) {
      throw new HttpException('Failed to get accounts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    try {
      const existingAccount = await this.prisma.account.findUnique({
        where: { id },
      }); 
      if (!existingAccount) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      return await this.prisma.account.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException('Failed to update account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteAccount(id: number): Promise<Account> {
    try {
      const deletedAccount = await this.prisma.account.delete({
        where: { id },
      });

      return deletedAccount;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
