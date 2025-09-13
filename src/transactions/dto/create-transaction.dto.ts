import {  IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
export enum TransactionType {
  DEPOSIT,
  WITHDRAW,
  TRANSFER,
  PAYMENT
}

export class CreateTransactionDto {
  @IsInt() 
  accountId: number; 

  @IsOptional() 
  @IsInt()
  senderId?: number;

  @IsOptional()
  @IsInt()
  receiverId?: number;

  @IsEnum(TransactionType) 
  type: TransactionType;

  @IsPositive()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}