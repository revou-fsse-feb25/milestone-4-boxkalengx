import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import type { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post('deposit')
  async deposit(@CurrentUser() user: User, @Body() dto: DepositDto) {
    try {
      return await this.service.deposit(user.id, dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('withdraw')
  async withdraw(@CurrentUser() user: User, @Body() dto: WithdrawDto) {
    try {
      return await this.service.withdraw(user.id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Post('transfer')
  async transfer(@CurrentUser() user: User, @Body() dto: TransferDto) {
    try {
      return await this.service.transfer(user.id, dto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async list(@CurrentUser() user: User) {
    try {
      return await this.service.getAllByUser(user.id, user.role);
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.service.getTransactionById(id, user.id, user.role);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Could not retrieve transaction');
    }
  }
}