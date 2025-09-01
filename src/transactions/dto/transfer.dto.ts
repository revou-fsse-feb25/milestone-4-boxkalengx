import { IsInt, IsPositive, IsString, IsOptional, IsEnum, NotEquals, IsDecimal } from 'class-validator';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransferDto {
  @IsInt()
  senderId: number;

  @IsInt()
  @NotEquals('senderId', { message: 'Receiver ID must be different from sender ID' })
  receiverId: number;

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
  type?: TransactionType = TransactionType.transfer;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  referenceNumber?: string
}