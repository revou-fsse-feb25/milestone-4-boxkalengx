import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
  UseGuards, Request, ForbiddenException, NotFoundException, BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account, Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(Role.ADMIN)
  async createAccount(@Body() createAccountDto: CreateAccountDto, @CurrentUser() user: User): Promise<Account> {
    try {
      return await this.accountsService.createAccount(createAccountDto, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllAccounts(): Promise<Account[]> {
    try {
      return await this.accountsService.getAllAccounts();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch accounts');
    }
  }

  @Get(':id')
  async getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<Account> {
    const account = await this.accountsService.getAccountById(id);
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);

    if (req.user.role !== 'admin' && req.user.id !== account.userId) {
      throw new ForbiddenException('You are not authorized to access this account');
    }

    return account;
  }

  @Patch(':id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<Account> {
    try {
      return await this.accountsService.updateAccount(id, updateAccountDto, req.user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteAccount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<{ message: string }> {
    try {
      await this.accountsService.deleteAccount(id, req.user);
      return { message: `Account ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}