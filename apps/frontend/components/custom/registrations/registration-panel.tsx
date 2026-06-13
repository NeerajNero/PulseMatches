"use client";

import { FormEvent, useMemo, useState } from "react";
import type { RegistrationDto, TournamentCategoryDto, TournamentDetailDto } from "@matchflow/client-sdk";
import {
  formatDateRange,
  formatFee,
  formatLabel
} from "@/components/custom/tournaments/tournament-format";
import { useCurrentUser } from "@/hooks/use-auth";
import { getApiErrorMessage, useCreateRegistration, useMyRegistrations } from "@/hooks/use-registrations";
import { ROUTES } from "@/utils/route";

const ACTIVE_REGISTRATION_STATUSES = new Set(["pending", "confirmed"]);

export function RegistrationPanel({ tournament }: Readonly<{ tournament: TournamentDetailDto }>) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(tournament.categories[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentUser = useCurrentUser();
  const isSignedIn = Boolean(currentUser.data);
  const registrations = useMyRegistrations(isSignedIn);
  const createRegistration = useCreateRegistration(tournament.slug);
  const selectedCategory = useMemo(
    () => tournament.categories.find((category) => category.id === selectedCategoryId),
    [selectedCategoryId, tournament.categories]
  );
  const activeRegistration = (registrations.data ?? []).find((registration) => (
    registration.tournament.id === tournament.id &&
    ACTIVE_REGISTRATION_STATUSES.has(registration.status)
  ));
  const canRegister = tournament.registrationAvailability === "registration_open";
  const isPlayer = currentUser.data?.roles.includes("PLAYER") ?? false;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const form = new FormData(event.currentTarget);
    const categoryId = tournament.categories.length > 0 ? String(form.get("categoryId") ?? "") : undefined;

    if (tournament.categories.length > 0 && !categoryId) {
      setError("Choose an event category before registering.");
      return;
    }

    try {
      const registration = await createRegistration.mutateAsync({
        tournamentCategoryId: categoryId,
        playerName: String(form.get("playerName") ?? "") || undefined,
        phone: String(form.get("phone") ?? "") || undefined,
        notes: String(form.get("notes") ?? "") || undefined
      });
      setSuccessMessage(
        registration?.paymentStatus === "pending_offline"
          ? "Registration submitted. The organizer will handle offline payment instructions."
          : "Registration submitted."
      );
    } catch (submitError) {
      setError(await getApiErrorMessage(submitError, "Unable to submit registration."));
    }
  }

  return (
    <section className="registration-panel" aria-labelledby="registration-heading">
      <div className="section-heading registration-heading">
        <span className="eyebrow">Player registration</span>
        <h2 id="registration-heading">Register for this tournament</h2>
        <p>
          {canRegister
            ? "Submit your player registration for an available event category."
            : `Registration is currently ${formatLabel(tournament.registrationAvailability).toLowerCase()}.`}
        </p>
      </div>

      {!isSignedIn && !currentUser.isLoading ? (
        <div className="registration-card">
          <h3>Sign in required</h3>
          <p>Player registration is available only for authenticated player accounts.</p>
          <div className="registration-actions">
            <a className="primary-action" href={ROUTES.LOGIN}>Log in</a>
            <a className="secondary-action" href={ROUTES.SIGNUP}>Create player account</a>
          </div>
        </div>
      ) : null}

      {currentUser.isLoading ? <p className="state-text compact-state">Checking account status.</p> : null}

      {isSignedIn && !isPlayer ? (
        <div className="registration-card">
          <h3>Player account required</h3>
          <p>This tournament registration flow is limited to player accounts.</p>
        </div>
      ) : null}

      {isSignedIn && isPlayer && activeRegistration ? (
        <div className="registration-card registration-success">
          <h3>Already registered</h3>
          <p>
            Your {formatLabel(activeRegistration.status).toLowerCase()} registration is on file
            {activeRegistration.category ? ` for ${activeRegistration.category.name}` : ""}.
          </p>
          <dl className="detail-list">
            <div><dt>Payment</dt><dd>{formatActiveRegistrationPayment(activeRegistration)}</dd></div>
            <div><dt>Tournament dates</dt><dd>{formatDateRange(tournament.startsAt, tournament.endsAt)}</dd></div>
          </dl>
          <a className="secondary-action" href={ROUTES.ACCOUNT_REGISTRATIONS}>View my registrations</a>
        </div>
      ) : null}

      {isSignedIn && isPlayer && !activeRegistration ? (
        <form className="registration-card registration-form" onSubmit={onSubmit}>
          {tournament.categories.length > 0 ? (
            <label>
              <span>Event category</span>
              <select
                name="categoryId"
                value={selectedCategoryId}
                onChange={(event) => setSelectedCategoryId(event.target.value)}
                required
              >
                {tournament.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {formatCategoryOption(category)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="registration-note">
              <strong>Tournament-level registration</strong>
              <span>No event categories are listed yet, so this registration will apply to the tournament.</span>
            </div>
          )}

          <div className="registration-note">
            <strong>{selectedCategory ? formatFee(selectedCategory) : "Free entry"}</strong>
            <span>
              {selectedCategory && selectedCategory.entryFeeAmount > 0
                ? "Payment is offline/manual for this MVP. Do not enter payment details here."
                : "No payment is required for this registration."}
            </span>
          </div>

          <label>
            <span>Player name</span>
            <input
              name="playerName"
              type="text"
              minLength={2}
              defaultValue={currentUser.data?.displayName ?? ""}
              autoComplete="name"
            />
          </label>
          <label>
            <span>Phone (optional)</span>
            <input name="phone" type="tel" minLength={7} maxLength={40} autoComplete="tel" />
          </label>
          <label>
            <span>Notes (optional)</span>
            <textarea name="notes" maxLength={500} rows={4} />
          </label>

          {successMessage ? <p className="form-success">{successMessage}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}

          <button
            className="primary-action form-action"
            type="submit"
            disabled={!canRegister || createRegistration.isPending || registrations.isLoading}
          >
            {createRegistration.isPending ? "Submitting" : "Submit registration"}
          </button>
        </form>
      ) : null}
    </section>
  );
}

function formatActiveRegistrationPayment(registration: RegistrationDto) {
  const payment = registration.payment;
  const amount = payment?.amount ?? registration.feeAmount;
  const status = payment?.status ?? registration.paymentStatus;
  if (amount <= 0 || status === "not_required") {
    return "Not required";
  }
  return `${payment?.currency ?? registration.feeCurrency} ${amount} · ${formatLabel(status)}`;
}

function formatCategoryOption(category: TournamentCategoryDto) {
  const labels = [
    formatLabel(category.participantType),
    formatLabel(category.genderType),
    formatFee(category)
  ];
  return labels.join(", ");
}
