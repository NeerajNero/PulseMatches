import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { NotificationsRepository } from "./notifications.repository";

@Injectable()
export class NotificationsDbService {
  constructor(private readonly repository: NotificationsRepository) {}

  createNotification(input: Prisma.NotificationOutboxUncheckedCreateInput) {
    return this.repository.createNotification(input);
  }

  createNotifications(inputs: Prisma.NotificationOutboxCreateManyInput[]) {
    return this.repository.createNotifications(inputs);
  }

  findPendingNotifications(input: { now: Date; limit: number }) {
    return this.repository.findPendingNotifications(input);
  }

  markProcessing(id: string) {
    return this.repository.markProcessing(id);
  }

  markSent(input: { id: string; provider: string; providerMessageId?: string | null }) {
    return this.repository.markSent(input);
  }

  markSkipped(input: { id: string; reason: string; provider: string }) {
    return this.repository.markSkipped(input);
  }

  markRetry(input: { id: string; error: string; nextScheduledAt: Date }) {
    return this.repository.markRetry(input);
  }

  markFailed(input: { id: string; error: string }) {
    return this.repository.markFailed(input);
  }
}
