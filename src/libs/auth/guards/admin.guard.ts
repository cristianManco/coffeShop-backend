import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BaseAuthGuard } from './base-auth.guard';
import { res } from 'src/utils/res';

@Injectable()
export class AdminGuard extends BaseAuthGuard {
  protected validateRole(
    decodedToken: any,
    context: ExecutionContext,
  ): boolean {
    if (decodedToken.role !== 'admin') {
      throw new ForbiddenException(
        res(false, 'Only admins can perform this action', null),
      );
    }
    return true;
  }
}
