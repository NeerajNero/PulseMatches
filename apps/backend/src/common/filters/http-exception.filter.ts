import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { ResponseUtil } from "../utils/response.util";

interface HttpErrorBody {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const body = typeof exceptionResponse === "object" && exceptionResponse !== null
      ? exceptionResponse as HttpErrorBody
      : null;
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? (exception instanceof Error ? exception.message : "Internal server error");

    response.status(statusCode).json(ResponseUtil.error(message, statusCode, body?.error ?? null));
  }
}

