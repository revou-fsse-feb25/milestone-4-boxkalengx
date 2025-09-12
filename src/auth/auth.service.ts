import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid ? user : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
  }
  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('credentials are invalid');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('credentials are invalid');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    try {
      const { email, password, name } = dto;

      const existing = await this.usersService.getUserByEmail(email);
      if (existing) {
        throw new ConflictException('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.usersService.createUser({
        name,
        role: 'USER',
        email,
        password: hashedPassword, 
      });

      const { password: _removed, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }
}
