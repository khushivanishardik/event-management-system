// Location: backend/src/common/middleware/logger.middleware.ts
// Purpose: HTTP request logger middleware. Logs method, URL, status code,
//          and response time for every request to help with debugging.

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const elapsed = Date.now() - start;
      const color =
        statusCode >= 500
          ? '\x1b[31m' // red
          : statusCode >= 400
            ? '\x1b[33m' // yellow
            : '\x1b[32m'; // green

      this.logger.log(
        `${color}${method}\x1b[0m ${originalUrl} → ${statusCode} (${elapsed}ms)`,
      );
    });

    next();
  }
}
