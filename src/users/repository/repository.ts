import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

async getAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new HttpException('failed to get all users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException('failed to get user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new HttpException('Error saat mencari user berdasarkan email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
