import { RoleType } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: RoleType[];
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: RoleType[];
}

