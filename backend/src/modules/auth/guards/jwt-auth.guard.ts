import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err, user, info) {

    console.log('====================');
    console.log('JWT USER =', user);
    console.log('JWT ERR =', err);
    console.log('JWT INFO =', info);
    console.log('====================');

    if (info) {
      console.log('INFO MESSAGE:', info.message);
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}