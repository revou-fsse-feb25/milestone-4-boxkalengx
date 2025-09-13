import { IsInt, IsPositive, IsString, IsOptional, IsEnum, NotEquals } from 'class-validator';
import { TransactionType } from './create-transaction.dto';


export class TransferDto {
  @IsInt()
  senderId: number;

  @IsInt()
  @NotEquals('senderId', { message: 'Receiver ID must be different from sender ID' })
  receiverId: number;

  @IsInt()
  accountId: number;

  @IsPositive()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType = TransactionType.TRANSFER;

}