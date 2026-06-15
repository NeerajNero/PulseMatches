import { Injectable } from "@nestjs/common";
import { PaymentRefundStatus, Prisma, RegistrationPaymentStatus } from "@prisma/client";
import { OrganizerRostersRepository } from "./organizer-rosters.repository";

@Injectable()
export class OrganizerRostersDbService {
  constructor(private readonly repository: OrganizerRostersRepository) {}

  findOrganizerProfileByUserId(userId: string) {
    return this.repository.findOrganizerProfileByUserId(userId);
  }

  findOwnedTournament(id: string, organizerProfileId: string) {
    return this.repository.findOwnedTournament(id, organizerProfileId);
  }

  findCategoryById(categoryId: string) {
    return this.repository.findCategoryById(categoryId);
  }

  countRegistrations(where: Prisma.RegistrationWhereInput) {
    return this.repository.countRegistrations(where);
  }

  getTournamentReportSummary(input: { tournamentId: string; createdAt?: Prisma.DateTimeFilter }) {
    return this.repository.getTournamentReportSummary(input);
  }

  findRegistrations(where: Prisma.RegistrationWhereInput, take?: number) {
    return this.repository.findRegistrations(where, take);
  }

  findPayments(where: Prisma.RegistrationWhereInput, take?: number) {
    return this.repository.findPayments(where, take);
  }

  findRegistrationById(registrationId: string) {
    return this.repository.findRegistrationById(registrationId);
  }

  findPaymentDetailByRegistrationId(registrationId: string) {
    return this.repository.findPaymentDetailByRegistrationId(registrationId);
  }

  approveRegistrationAndCreateParticipant(input: {
    registrationId: string;
    participant: Prisma.ParticipantUncheckedCreateInput;
  }) {
    return this.repository.approveRegistrationAndCreateParticipant(input);
  }

  updateRegistrationStatus(registrationId: string, data: Prisma.RegistrationUncheckedUpdateInput) {
    return this.repository.updateRegistrationStatus(registrationId, data);
  }

  updateRegistrationPayment(input: {
    registrationId: string;
    status: RegistrationPaymentStatus;
    reference?: string | null;
    internalNotes?: string | null;
    paidAt?: Date | null;
    verifiedByOrganizerUserId: string;
  }) {
    return this.repository.updateRegistrationPayment(input);
  }

  createPaymentRefund(input: {
    registrationId: string;
    amount: number;
    status: PaymentRefundStatus;
    reason?: string | null;
    internalNotes?: string | null;
    requestedByUserId: string;
    processedByUserId?: string | null;
  }) {
    return this.repository.createPaymentRefund(input);
  }

  countParticipants(where: Prisma.ParticipantWhereInput) {
    return this.repository.countParticipants(where);
  }

  findParticipants(where: Prisma.ParticipantWhereInput, take?: number) {
    return this.repository.findParticipants(where, take);
  }

  findParticipantById(participantId: string) {
    return this.repository.findParticipantById(participantId);
  }

  createParticipant(input: Prisma.ParticipantUncheckedCreateInput) {
    return this.repository.createParticipant(input);
  }

  updateParticipant(participantId: string, input: Prisma.ParticipantUncheckedUpdateInput) {
    return this.repository.updateParticipant(participantId, input);
  }

  countTeams(where: Prisma.TeamWhereInput) {
    return this.repository.countTeams(where);
  }

  findTeams(where: Prisma.TeamWhereInput, take?: number) {
    return this.repository.findTeams(where, take);
  }

  findTeamById(teamId: string) {
    return this.repository.findTeamById(teamId);
  }

  findActiveTeamByName(input: {
    tournamentId: string;
    tournamentCategoryId: string | null;
    name: string;
  }) {
    return this.repository.findActiveTeamByName(input);
  }

  createTeam(input: Prisma.TeamUncheckedCreateInput) {
    return this.repository.createTeam(input);
  }

  updateTeam(teamId: string, input: Prisma.TeamUncheckedUpdateInput) {
    return this.repository.updateTeam(teamId, input);
  }

  findTeamMemberById(memberId: string) {
    return this.repository.findTeamMemberById(memberId);
  }

  findTeamMemberByParticipant(teamId: string, participantId: string) {
    return this.repository.findTeamMemberByParticipant(teamId, participantId);
  }

  createTeamMember(input: Prisma.TeamMemberUncheckedCreateInput) {
    return this.repository.createTeamMember(input);
  }

  updateTeamMember(memberId: string, input: Prisma.TeamMemberUncheckedUpdateInput) {
    return this.repository.updateTeamMember(memberId, input);
  }

  deleteTeamMember(memberId: string) {
    return this.repository.deleteTeamMember(memberId);
  }

  createAuditLog(input: {
    actorId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.repository.createAuditLog(input);
  }
}
