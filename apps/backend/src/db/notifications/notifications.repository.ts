import { Injectable } from "@nestjs/common";
import { NotificationStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNotification(input: Prisma.NotificationOutboxUncheckedCreateInput) {
    return this.prisma.notificationOutbox.create({ data: input });
  }

  createNotifications(inputs: Prisma.NotificationOutboxCreateManyInput[]) {
    if (inputs.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    return this.prisma.notificationOutbox.createMany({
      data: inputs,
      skipDuplicates: true
    });
  }

  findPendingNotifications(input: { now: Date; limit: number }) {
    return this.prisma.notificationOutbox.findMany({
      where: {
        status: NotificationStatus.PENDING,
        OR: [
          { scheduledAt: null },
          { scheduledAt: { lte: input.now } }
        ]
      },
      orderBy: [
        { scheduledAt: { sort: "asc", nulls: "first" } },
        { createdAt: "asc" }
      ],
      take: input.limit
    });
  }

  async markProcessing(id: string) {
    const updated = await this.prisma.notificationOutbox.updateMany({
      where: { id, status: NotificationStatus.PENDING },
      data: {
        status: NotificationStatus.PROCESSING,
        attempts: { increment: 1 },
        lastError: null
      }
    });

    if (updated.count === 0) {
      return null;
    }

    return this.prisma.notificationOutbox.findUnique({ where: { id } });
  }

  markSent(input: { id: string; provider: string; providerMessageId?: string | null }) {
    return this.prisma.notificationOutbox.update({
      where: { id: input.id },
      data: {
        status: NotificationStatus.SENT,
        provider: input.provider,
        providerMessageId: input.providerMessageId ?? null,
        processedAt: new Date(),
        lastError: null
      }
    });
  }

  markSkipped(input: { id: string; reason: string; provider: string }) {
    return this.prisma.notificationOutbox.update({
      where: { id: input.id },
      data: {
        status: NotificationStatus.SKIPPED,
        provider: input.provider,
        processedAt: new Date(),
        lastError: input.reason
      }
    });
  }

  markRetry(input: { id: string; error: string; nextScheduledAt: Date }) {
    return this.prisma.notificationOutbox.update({
      where: { id: input.id },
      data: {
        status: NotificationStatus.PENDING,
        scheduledAt: input.nextScheduledAt,
        lastError: input.error
      }
    });
  }

  markFailed(input: { id: string; error: string }) {
    return this.prisma.notificationOutbox.update({
      where: { id: input.id },
      data: {
        status: NotificationStatus.FAILED,
        processedAt: new Date(),
        lastError: input.error
      }
    });
  }
}
