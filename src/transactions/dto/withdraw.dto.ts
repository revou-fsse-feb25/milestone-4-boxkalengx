import { IsInt, IsPositive, IsString, IsOptional, IsEnum } from 'class-validator';
import { TransactionType } from './create-transaction.dto';



export class WithdrawDto {
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
  type?: TransactionType = TransactionType.WITHDRAW;

}