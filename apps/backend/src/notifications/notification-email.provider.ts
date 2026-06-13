import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailDeliveryInput, EmailDeliveryResult } from "./notification.types";

@Injectable()
export class NotificationEmailProvider {
  private readonly logger = new Logger(NotificationEmailProvider.name);
  private smtpTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

  constructor(private readonly config: ConfigService) {}

  getProviderName() {
    return this.config.get<string>("NOTIFICATION_PROVIDER", "noop").toLowerCase();
  }

  async send(input: EmailDeliveryInput): Promise<EmailDeliveryResult> {
    const provider = this.getProviderName();

    if (provider === "noop") {
      return {
        provider,
        providerMessageId: `${provider}-${input.notificationId}`
      };
    }

    if (provider === "log") {
      this.logger.log(`Email notification ${input.notificationId} queued for ${input.to}: ${input.subject}`);
      return {
        provider,
        providerMessageId: `${provider}-${input.notificationId}`
      };
    }

    if (provider === "smtp") {
      const response = await this.getSmtpTransporter().sendMail({
        from: {
          name: this.config.get<string>("NOTIFICATION_FROM_NAME", "MatchFlow Arena"),
          address: this.config.get<string>("NOTIFICATION_FROM_EMAIL", "notifications@matchflow.local")
        },
        to: {
          name: input.recipientName ?? "",
          address: input.to
        },
        subject: input.subject,
        text: input.text,
        html: input.html
      });

      return {
        provider,
        providerMessageId: this.extractMessageId(response)
      };
    }

    throw new Error(`Unsupported notification provider: ${provider}`);
  }

  private getSmtpTransporter() {
    if (this.smtpTransporter) {
      return this.smtpTransporter;
    }

    const host = this.requireConfig("SMTP_HOST");
    const port = this.config.get<number>("SMTP_PORT", 587);
    const secure = this.config.get<boolean>("SMTP_SECURE", false);
    const requireTls = this.config.get<boolean>("SMTP_REQUIRE_TLS", false);
    const rejectUnauthorized = this.config.get<boolean>("SMTP_REJECT_UNAUTHORIZED", true);
    const allowUnauthenticated = this.config.get<boolean>("SMTP_ALLOW_UNAUTH", false);
    const user = this.config.get<string>("SMTP_USER", "");
    const pass = this.config.get<string>("SMTP_PASS", "");

    if (!allowUnauthenticated && (!user || !pass)) {
      throw new Error("SMTP credentials are required unless SMTP_ALLOW_UNAUTH=true");
    }

    const options: SMTPTransport.Options = {
      host,
      port,
      secure,
      requireTLS: requireTls,
      tls: {
        rejectUnauthorized
      },
      auth: user || pass
        ? {
            user,
            pass
          }
        : undefined
    };

    this.smtpTransporter = nodemailer.createTransport(options);
    return this.smtpTransporter;
  }

  private requireConfig(name: string) {
    const value = this.config.get<string>(name, "");
    if (!value.trim()) {
      throw new Error(`${name} is required for SMTP notifications`);
    }
    return value;
  }

  private extractMessageId(response: SMTPTransport.SentMessageInfo) {
    return typeof response.messageId === "string" && response.messageId
      ? response.messageId
      : null;
  }
}
