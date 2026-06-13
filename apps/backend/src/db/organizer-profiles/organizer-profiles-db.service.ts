import { Injectable } from "@nestjs/common";
import { OrganizerProfilesRepository } from "./organizer-profiles.repository";

@Injectable()
export class OrganizerProfilesDbService {
  constructor(private readonly repository: OrganizerProfilesRepository) {}

  findByUserId(userId: string) {
    return this.repository.findByUserId(userId);
  }

  findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  create(input: Parameters<OrganizerProfilesRepository["create"]>[0]) {
    return this.repository.create(input);
  }

  updateByUserId(userId: string, input: Parameters<OrganizerProfilesRepository["updateByUserId"]>[1]) {
    return this.repository.updateByUserId(userId, input);
  }
}

