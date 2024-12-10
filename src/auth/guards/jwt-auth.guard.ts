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
        // Add additional logging or custom logic if needed
        console.log('JwtAuthGuard - Activating',context);
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        console.log('JwtAuthGuard - HandleRequest', { err, user, info });

        // Detailed error handling
        if (err) {
            console.error('Authentication error:', err);
            throw new UnauthorizedException(err.message || 'Authentication failed');
        }

        if (!user) {
            if (info?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            if (info?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            }
            throw new UnauthorizedException('No user found');
        }

        return user;
    }
}