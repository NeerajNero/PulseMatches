import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import {
  Prisma,
  RegistrationPaymentMode,
  RegistrationPaymentStatus,
  RegistrationStatus,
  UserStatus
} from "@prisma/client";
import { RegistrationsDbService } from "../../db/registrations/registrations-db.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { CreateRegistrationRequestDto } from "./dto/registration.dto";
import { RegistrationsTransform } from "./registrations.transform";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;
const ACTIVE_REGISTRATION_STATUSES = [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED];

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly registrationsDb: RegistrationsDbService,
    private readonly notifications: NotificationsService,
    private readonly transform: RegistrationsTransform
  ) {}

  async createTournamentRegistration(slugOrId: string, dto: CreateRegistrationRequestDto, currentUser: AuthenticatedUser) {
    const [user, tournament] = await Promise.all([
      this.registrationsDb.findUserById(currentUser.id),
      this.findPublicTournament(slugOrId)
    ]);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Active user account required");
    }

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    this.assertRegistrationWindow(tournament.registrationOpensAt, tournament.registrationClosesAt);

    const activeCategories = tournament.categories;
    const tournamentCategoryId = dto.tournament_category_id?.trim() || null;

    if (activeCategories.length > 0 && !tournamentCategoryId) {
      throw new BadRequestException("Tournament category is required for this tournament");
    }

    const category = tournamentCategoryId
      ? activeCategories.find((item) => item.id === tournamentCategoryId)
      : null;

    if (tournamentCategoryId && !category) {
      throw new BadRequestException("Tournament category was not found for this tournament");
    }

    const duplicate = await this.registrationsDb.findActiveRegistration({
      userId: currentUser.id,
      tournamentId: tournament.id,
      tournamentCategoryId,
      statuses: ACTIVE_REGISTRATION_STATUSES
    });

    if (duplicate) {
      throw new ConflictException("You already have an active registration for this tournament");
    }

    if (category?.capacity !== null && category?.capacity !== undefined) {
      const activeRegistrationCount = await this.registrationsDb.countActiveCategoryRegistrations({
        tournamentCategoryId: category.id,
        statuses: ACTIVE_REGISTRATION_STATUSES
      });

      if (activeRegistrationCount >= category.capacity) {
        throw new ConflictException("This tournament category is full");
      }
    }

    const feeAmount = category?.entryFeeAmount ?? 0;
    const feeCurrency = category?.entryFeeCurrency ?? "INR";
    const registration = await this.registrationsDb.createRegistration({
      userId: currentUser.id,
      tournamentId: tournament.id,
      tournamentCategoryId,
      status: RegistrationStatus.PENDING,
      paymentMode: feeAmount > 0 ? RegistrationPaymentMode.OFFLINE : RegistrationPaymentMode.FREE,
      paymentStatus: feeAmount > 0
        ? RegistrationPaymentStatus.PENDING_OFFLINE
        : RegistrationPaymentStatus.NOT_REQUIRED,
      feeAmount,
      feeCurrency,
      playerName: this.cleanOptionalString(dto.player_name) ?? user.displayName,
      phone: this.cleanOptionalString(dto.phone),
      notes: this.cleanOptionalString(dto.notes)
    });

    await this.registrationsDb.createAuditLog({
      actorId: currentUser.id,
      entityType: "Registration",
      entityId: registration.id,
      action: "registration.created",
      metadata: {
        tournament_id: tournament.id,
        tournament_category_id: tournamentCategoryId,
        payment_status: registration.paymentStatus
      } satisfies Prisma.InputJsonObject
    });

    await this.notifications.enqueueRegistrationCreated({
      registrationId: registration.id,
      recipientUserId: currentUser.id,
      recipientEmail: user.email,
      recipientName: registration.playerName,
      tournamentId: tournament.id,
      tournamentCategoryId,
      tournamentTitle: tournament.title,
      tournamentSlug: tournament.slug,
      categoryName: category?.name ?? null
    });

    return this.transform.toRegistration(registration);
  }

  async findMyRegistrations(currentUser: AuthenticatedUser) {
    const registrations = await this.registrationsDb.findRegistrationsByUser(currentUser.id);
    return registrations.map((registration) => this.transform.toRegistration(registration));
  }

  async findRegistration(id: string, currentUser: AuthenticatedUser) {
    const registration = await this.registrationsDb.findRegistrationById(id);

    if (!registration) {
      throw new NotFoundException("Registration not found");
    }

    if (registration.userId !== currentUser.id) {
      throw new ForbiddenException("You can only view your own registration");
    }

    return this.transform.toRegistration(registration);
  }

  async cancelRegistration(id: string, currentUser: AuthenticatedUser) {
    const registration = await this.registrationsDb.findRegistrationById(id);

    if (!registration) {
      throw new NotFoundException("Registration not found");
    }

    if (registration.userId !== currentUser.id) {
      throw new ForbiddenException("You can only cancel your own registration");
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException("Only pending registrations can be cancelled");
    }

    const cancelledRegistration = await this.registrationsDb.cancelRegistration(id);

    await this.registrationsDb.createAuditLog({
      actorId: currentUser.id,
      entityType: "Registration",
      entityId: id,
      action: "registration.cancelled",
      metadata: {
        tournament_id: registration.tournamentId,
        tournament_category_id: registration.tournamentCategoryId
      } satisfies Prisma.InputJsonObject
    });

    await this.notifications.enqueueRegistrationCancelled({
      registrationId: registration.id,
      recipientUserId: currentUser.id,
      recipientEmail: currentUser.email,
      recipientName: registration.playerName,
      tournamentId: registration.tournamentId,
      tournamentCategoryId: registration.tournamentCategoryId,
      tournamentTitle: registration.tournament.title,
      tournamentSlug: registration.tournament.slug,
      categoryName: registration.tournamentCategory?.name ?? null
    });

    return this.transform.toRegistration(cancelledRegistration);
  }

  private findPublicTournament(slugOrId: string) {
    return UUID_PATTERN.test(slugOrId)
      ? this.registrationsDb.findPublicTournamentById(slugOrId)
      : this.registrationsDb.findPublicTournamentBySlug(slugOrId);
  }

  private assertRegistrationWindow(opensAt: Date | null, closesAt: Date | null) {
    const now = new Date();

    if (opensAt && opensAt > now) {
      throw new BadRequestException("Registration is not open yet");
    }

    if (closesAt && closesAt < now) {
      throw new BadRequestException("Registration is closed");
    }
  }

  private cleanOptionalString(value?: string): string | null {
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : null;
  }
}
