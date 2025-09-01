import { IsInt, IsPositive, IsString, IsOptional, IsEnum, IsDecimal } from 'class-validator';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class WithdrawDto {
  @IsInt()
  accountId: number;

  @IsPositive()
  @IsDecimal()
  amount: Decimal;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType = TransactionType.withdrawal;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
}