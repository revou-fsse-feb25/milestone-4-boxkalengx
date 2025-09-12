import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(jwtpayload: jwtPayloadInterface) {
    try {
      const { id, email, role } = jwtpayload;
      if (!id || !email) {
        throw new UnauthorizedException('Invalid token payload');
      }
      return { id, email, role };
    } catch (error) {
      console.log('JWT validation error:', error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}