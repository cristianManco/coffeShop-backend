import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../services/token.service';
import { res } from 'src/libs/utils/res';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const token = await this.extractTokenFromHeader(
      request.headers.authorization,
    );

    if (!token) {
      throw new UnauthorizedException(
        res(false, 'No JWT token provided', null),
      );
    }

    if (!this.tokenService.isTokenInvalidated(token)) {
      throw new UnauthorizedException(
        res(false, 'Token has been invalidated', null),
      );
    }

    try {
      const decodedToken = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      request.user = decodedToken;

      return await this.validateRole(await decodedToken, context);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new UnauthorizedException(res(false, 'Invalid token', null));
      }
    }
  }

  protected validateRole(
    decodedToken: JwtPayload,
    context: ExecutionContext,
  ): boolean {
    return true;
  }

  private extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader) return null;
    const [, token] = authorizationHeader.split(' ');
    return token || null;
  }
}
