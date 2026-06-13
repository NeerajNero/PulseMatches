import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ResponseUtil, type ApiEnvelope } from "../utils/response.util";

function isEnvelope(value: unknown): value is ApiEnvelope {
  return Boolean(value && typeof value === "object" && "status_code" in value && "status" in value);
}

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (isEnvelope(data)) {
          return data;
        }
        return ResponseUtil.success(data, "Request successful", response.statusCode);
      })
    );
  }
}

