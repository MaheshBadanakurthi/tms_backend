import {
    Injectable,
    ExecutionContext,
    UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            // Different scenarios based on authentication failure
            if (info?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            if (info?.name === 'JsonWebTokenError') {   
                throw new UnauthorizedException('Invalid token');
            }
            throw new UnauthorizedException(
                err?.message ||
                'Please log in to access this resource'
            );
        }
        return user;
    }
}