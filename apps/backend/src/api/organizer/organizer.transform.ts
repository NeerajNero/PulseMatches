import { OrganizerProfile } from "@prisma/client";
import { OrganizerProfileResponseDto } from "./dto/organizer-profile.dto";

export class OrganizerTransform {
  toResponse(profile: OrganizerProfile): OrganizerProfileResponseDto {
    return {
      id: profile.id,
      organization_name: profile.organizationName,
      slug: profile.slug,
      contact_email: profile.contactEmail,
      contact_phone: profile.contactPhone,
      verification_status: profile.verificationStatus,
      status: profile.status,
      user_id: profile.userId,
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString()
    };
  }
}

