import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const resObject: any = exception instanceof HttpException ? exception?.getResponse() : null;
    const message = exception instanceof HttpException ? resObject.message : 'Internal server error';

    this.logger.error(
      resObject
        ? `[${req.method}] ${req.path} [RESPONSE] ${JSON.stringify(resObject)} [STACK] ${exception?.stack}`
        : `[STACK] ${exception.stack}`,
    );

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      errors: resObject?.error,
    });
  }
}
