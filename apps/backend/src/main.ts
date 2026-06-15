import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, rawBody: true });
  const config = app.get(ConfigService);
  const corsOrigins = config.get<string>("CORS_ORIGINS", "").split(",").map((origin) => origin.trim()).filter(Boolean);
  const expressApp = app.getHttpAdapter().getInstance();

  if (typeof expressApp.disable === "function") {
    expressApp.disable("x-powered-by");
  }
  app.use(helmet());
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());

  const documentConfig = new DocumentBuilder()
    .setTitle("MatchFlow Arena API")
    .setDescription("API contract for MatchFlow Arena.")
    .setVersion(config.get<string>("APP_VERSION", "0.1.0"))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup("docs", app, document);

  const port = config.get<number>("PORT", 3000);
  await app.listen(port);
}

void bootstrap();
