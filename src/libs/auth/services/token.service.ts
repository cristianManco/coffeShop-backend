import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwtPayload.type';
import { res } from 'src/utils/res';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types/toke.type';

@Injectable()
export class TokenService {
  private invalidatedTokens: Set<string> = new Set();
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload, options: any): Promise<string> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new HttpException(
        res(false, 'JWT_SECRET is not set', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      return this.jwtService.signAsync(payload, {
        secret: secretKey,
        ...options,
      });
    } catch (error) {
      throw new HttpException(
        res(false, 'Error generating JWT token', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const accessTokenOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    };

    const accessToken = await this.generateToken(
      jwtPayload,
      accessTokenOptions,
    );
    return { access_token: accessToken };
  }

  invalidateToken(token: string): void {
    this.invalidatedTokens.add(token);
  }

  isTokenInvalidated(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }
}
