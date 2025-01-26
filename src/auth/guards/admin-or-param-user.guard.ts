import { Injectable, ForbiddenException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminOrRequestUserParamGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tokenId = user.id;

    const requestParamsId = request.params.id;

    if (requestParamsId && (user.isAdmin || tokenId === +requestParamsId)) {
      return true;
    }

    throw new ForbiddenException(
      'Você não possui permissão para acessar este recurso',
    );
  }
}
