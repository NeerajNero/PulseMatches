import { OrganizerProfile, RoleType, UserStatus } from "@prisma/client";
import { UserWithAuthRelations } from "../../db/auth/auth.repository";
import { CurrentUserDto, OrganizerProfileSummaryDto } from "./dto/auth.dto";

export class AuthTransform {
  toCurrentUser(user: UserWithAuthRelations): CurrentUserDto {
    return {
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      roles: user.roles.map((role) => role.role),
      status: user.status,
      organizer_profile: user.organizerProfile ? this.toOrganizerSummary(user.organizerProfile) : null
    };
  }

  toTokenRoles(roles: { role: RoleType }[]): RoleType[] {
    return roles.map((role) => role.role);
  }

  private toOrganizerSummary(profile: OrganizerProfile): OrganizerProfileSummaryDto {
    return {
      id: profile.id,
      organization_name: profile.organizationName,
      slug: profile.slug,
      contact_email: profile.contactEmail,
      contact_phone: profile.contactPhone,
      verification_status: profile.verificationStatus,
      status: profile.status
    };
  }

  isActiveUserStatus(status: UserStatus): boolean {
    return status === UserStatus.ACTIVE;
  }
}

