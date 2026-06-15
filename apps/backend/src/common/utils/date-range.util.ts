import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export interface DateRangeQuery {
  from?: string;
  to?: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateRange(query: DateRangeQuery): DateRange {
  const from = query.from ? parseDateBoundary(query.from, "from", "start") : undefined;
  const to = query.to ? parseDateBoundary(query.to, "to", "end") : undefined;

  if (from && to && from.getTime() > to.getTime()) {
    throw new BadRequestException("Invalid date range: from must be before or equal to to");
  }

  return { from, to };
}

export function toCreatedAtRange(range: DateRange): Prisma.DateTimeFilter | undefined {
  if (!range.from && !range.to) {
    return undefined;
  }
  return {
    ...(range.from ? { gte: range.from } : {}),
    ...(range.to ? { lte: range.to } : {})
  };
}

export function serializeDateRange(query: DateRangeQuery): Record<string, string> {
  return {
    ...(query.from ? { from: query.from } : {}),
    ...(query.to ? { to: query.to } : {})
  };
}

function parseDateBoundary(value: string, field: "from" | "to", boundary: "start" | "end"): Date {
  const trimmed = value.trim();
  const source = DATE_ONLY_PATTERN.test(trimmed)
    ? `${trimmed}T${boundary === "start" ? "00:00:00.000" : "23:59:59.999"}Z`
    : trimmed;
  const date = new Date(source);

  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`Invalid ${field} date. Use an ISO date or date-time string.`);
  }

  return date;
}
