export interface ApiEnvelope<TData = unknown> {
  status_code: number;
  status: "Success" | "Error";
  message: string;
  data: TData | null;
  error: unknown | null;
}

export class ResponseUtil {
  static success<TData>(data: TData, message = "Request successful", statusCode = 200): ApiEnvelope<TData> {
    return {
      status_code: statusCode,
      status: "Success",
      message,
      data,
      error: null
    };
  }

  static error(message: string, statusCode: number, error: unknown = null): ApiEnvelope<null> {
    return {
      status_code: statusCode,
      status: "Error",
      message,
      data: null,
      error
    };
  }
}

