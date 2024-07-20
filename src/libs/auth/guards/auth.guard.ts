import { Injectable } from '@nestjs/common';
import { BaseAuthGuard } from './base-auth.guard';

@Injectable()
export class AuthGuard extends BaseAuthGuard {
  protected validateRole(decodedToken: any): boolean {
    return true;
  }
}
