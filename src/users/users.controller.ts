import { Controller, Get, Post, Body,  BadRequestException, InternalServerErrorException, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    try {
      console.log(user);
      return await this.usersService.getUserById(user.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get user profile');
    }
  }
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.updateUser(user.id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
}