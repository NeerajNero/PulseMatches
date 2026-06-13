import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import crypto from "node:crypto";
import { AuthDbService } from "../../db/auth/auth-db.service";
import { OrganizerProfilesDbService } from "../../db/organizer-profiles/organizer-profiles-db.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { CreateOrganizerProfileRequestDto, UpdateOrganizerProfileRequestDto } from "./dto/organizer-profile.dto";
import { OrganizerTransform } from "./organizer.transform";

@Injectable()
export class OrganizerService {
  constructor(
    private readonly organizerProfilesDb: OrganizerProfilesDbService,
    private readonly authDb: AuthDbService,
    private readonly transform: OrganizerTransform
  ) {}

  async getProfile(currentUser: AuthenticatedUser) {
    const profile = await this.organizerProfilesDb.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException("Organizer profile not found");
    }
    return this.transform.toResponse(profile);
  }

  async createProfile(currentUser: AuthenticatedUser, dto: CreateOrganizerProfileRequestDto) {
    const existing = await this.organizerProfilesDb.findByUserId(currentUser.id);
    if (existing) {
      throw new ConflictException("Organizer profile already exists");
    }

    const profile = await this.organizerProfilesDb.create({
      userId: currentUser.id,
      organizationName: dto.organization_name.trim(),
      slug: await this.createUniqueSlug(dto.organization_name),
      contactEmail: dto.contact_email.trim().toLowerCase(),
      contactPhone: dto.contact_phone?.trim()
    });

    await this.authDb.createAuditLog({
      actorId: currentUser.id,
      entityType: "organizer_profile",
      entityId: profile.id,
      action: "organizer_profile.create"
    });

    return this.transform.toResponse(profile);
  }

  async updateProfile(currentUser: AuthenticatedUser, dto: UpdateOrganizerProfileRequestDto) {
    const existing = await this.organizerProfilesDb.findByUserId(currentUser.id);
    if (!existing) {
      throw new NotFoundException("Organizer profile not found");
    }

    const organizationName = dto.organization_name?.trim();
    const profile = await this.organizerProfilesDb.updateByUserId(currentUser.id, {
      organizationName,
      slug: organizationName && organizationName !== existing.organizationName
        ? await this.createUniqueSlug(organizationName)
        : undefined,
      contactEmail: dto.contact_email?.trim().toLowerCase(),
      contactPhone: dto.contact_phone === undefined ? undefined : dto.contact_phone.trim()
    });

    await this.authDb.createAuditLog({
      actorId: currentUser.id,
      entityType: "organizer_profile",
      entityId: profile.id,
      action: "organizer_profile.update"
    });

    return this.transform.toResponse(profile);
  }

  private async createUniqueSlug(name: string) {
    const baseSlug = this.slugify(name);
    for (let index = 0; index < 20; index += 1) {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
      const existing = await this.organizerProfilesDb.findBySlug(slug);
      if (!existing) {
        return slug;
      }
    }
    return `${baseSlug}-${crypto.randomBytes(4).toString("hex")}`;
  }

  private slugify(value: string) {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || `organizer-${crypto.randomBytes(4).toString("hex")}`;
  }
}

