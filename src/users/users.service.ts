import { Injectable, } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/repository';
import { User } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(createUserDto);
  }

  async getUserById(currentUserId: number): Promise<User> {
    const user = await this.usersRepository.getUserById(currentUserId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.getUserByEmail(email);
  }

  async getAllUsers(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'ADMIN') {
      throw new Error('Only admins can access all users');
    }
    const users = await this.usersRepository.getAllUsers();
    return users;
  }
  async updateUser(currentUserId: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersRepository.updateUser(currentUserId, updateUserDto);
  }

  async deleteUser(id: number, currentUserId: number): Promise<void> {
    if (id !== currentUserId) {
      throw new Error('You can only delete your own user data');
    }
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.usersRepository.deleteUser(id);
  }
}
