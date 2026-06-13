import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const organizerProfileInclude = {
  user: {
    select: {
      id: true,
      email: true,
      displayName: true,
      status: true
    }
  }
} satisfies Prisma.OrganizerProfileInclude;

@Injectable()
export class OrganizerProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string) {
    return this.prisma.organizerProfile.findUnique({
      where: { userId },
      include: organizerProfileInclude
    });
  }

  findBySlug(slug: string) {
    return this.prisma.organizerProfile.findUnique({
      where: { slug },
      select: { id: true }
    });
  }

  create(input: {
    userId: string;
    organizationName: string;
    slug: string;
    contactEmail: string;
    contactPhone?: string;
  }) {
    return this.prisma.organizerProfile.create({
      data: input,
      include: organizerProfileInclude
    });
  }

  updateByUserId(userId: string, input: {
    organizationName?: string;
    slug?: string;
    contactEmail?: string;
    contactPhone?: string | null;
  }) {
    return this.prisma.organizerProfile.update({
      where: { userId },
      data: input,
      include: organizerProfileInclude
    });
  }
}

