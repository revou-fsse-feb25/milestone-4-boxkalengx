import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException('Email or username already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto.email, dto.password);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new BadRequestException('Invalid email or password');
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
      }
      
    
