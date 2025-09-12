import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './repository.ts/repository';

@Injectable()
export class AccountsService  {
  constructor(private readonly accountRepository: AccountsRepository) {}

  async getAllAccounts(): Promise<Account[]> {
    try {
      return await this.accountRepository.getAllAccounts();
    } catch {
      throw new InternalServerErrorException('Failed to get accounts');
    }
  }

  async getAccountById(id: number): Promise<Account | null> {
    const account = await this.accountRepository.getAccountById(id);
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    return account;
  }

  async getAccountByUserId(userId: number): Promise<Account | null> {
    try {
      return await this.accountRepository.getAccountByUserId(userId);
    } catch {
      throw new InternalServerErrorException('Failed to get account by user ID');
    }
  }

async createAccount(createAccountDto: CreateAccountDto, user: User): Promise<Account> {
    const accountData = {
      ...createAccountDto,
      userId: user.id,
    };

    return this.accountRepository.createAccount(accountData);
  }

  async updateAccount(id: number, data: UpdateAccountDto, user: { id: number; role: string }): Promise<Account> {
    const existing = await this.accountRepository.getAccountById(id);
    if (!existing) throw new NotFoundException(`Account with ID ${id} not found`);

    if (existing.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to update this account');
    }

    try {
      return await this.accountRepository.updateAccount(id, data);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to update account');
    }
  }

  async deleteAccount(id: number, user: { id: number; role: string }): Promise<void> {
    const existing = await this.accountRepository.getAccountById(id);
    if (!existing) throw new NotFoundException(`Account with ID ${id} not found`);

    if (existing.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to delete this account');
    }

    try {
      await this.accountRepository.deleteAccount(id);
    } catch {
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}