const baseUrl = process.env.API_URL ?? "http://127.0.0.1:3010";
const runId = process.env.MVP_SMOKE_RUN_ID ?? String(Date.now());

const seedOrganizer = {
  email: process.env.MVP_SMOKE_ORGANIZER_EMAIL ?? "organizer@matchflow.local",
  password: process.env.MVP_SMOKE_ORGANIZER_PASSWORD ?? "OrganizerPass123!"
};

const seedPlayer = {
  email: process.env.MVP_SMOKE_PLAYER_EMAIL ?? "player@matchflow.local",
  password: process.env.MVP_SMOKE_PLAYER_PASSWORD ?? "PlayerPass123!"
};

const seedAdmin = {
  email: process.env.MVP_SMOKE_ADMIN_EMAIL ?? "admin@matchflow.local",
  password: process.env.MVP_SMOKE_ADMIN_PASSWORD ?? "AdminPass123!"
};

const publicForbiddenMarkers = [
  "email",
  "phone",
  "notes",
  "result_notes",
  "payment",
  "audit",
  "user_id"
];

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok && !options.allowFailure) {
    throw new Error(`${options.method ?? "GET"} ${path} failed ${response.status}: ${text}`);
  }
  return { body, response, text };
}

function payload(result) {
  return result.body?.data;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function log(message) {
  console.log(`mvp-smoke: ${message}`);
}

function assertCsvExport(result, expectedHeader) {
  const contentType = result.response.headers.get("content-type") ?? "";
  assert(contentType.includes("text/csv"), `CSV export returned unexpected content type: ${contentType}.`);
  assert(result.text.includes(expectedHeader), `CSV export did not include expected header: ${expectedHeader}.`);
  assert(result.text.split("\n").length >= 2, "CSV export did not include a header row.");
}

function assertNoForbiddenExportMarkers(text, label) {
  const lower = text.toLowerCase();
  for (const marker of ["password", "token", "secret", "webhook", "rawpayload", "keysecret"]) {
    assert(!lower.includes(marker), `${label} export leaked forbidden marker: ${marker}.`);
  }
}

async function login(credentials) {
  const result = await request("/auth/login", {
    method: "POST",
    body: credentials
  });
  return payload(result).tokens.access_token;
}

async function signupPlayer(label) {
  const email = `mvp-${label}-${runId}@example.com`;
  const result = await request("/auth/signup", {
    method: "POST",
    body: {
      email,
      password: "SmokePass123!",
      display_name: `MVP ${label} ${runId}`,
      role: "player",
      contact_phone: "+919999990000"
    }
  });
  return {
    email,
    token: payload(result).tokens.access_token
  };
}

async function signupOrganizer(label) {
  const email = `mvp-${label}-${runId}@example.com`;
  const organizationName = `MVP ${label} Club ${runId}`;
  const result = await request("/auth/signup", {
    method: "POST",
    body: {
      email,
      password: "SmokePass123!",
      display_name: `MVP ${label} Organizer ${runId}`,
      role: "organizer",
      organization_name: organizationName,
      contact_phone: "+919999990001"
    }
  });
  return {
    email,
    token: payload(result).tokens.access_token,
    organizerProfile: payload(result).user.organizer_profile
  };
}

async function main() {
  const health = await request("/health");
  assert(health.response.status === 200, "Health endpoint did not respond.");

  const publicTournaments = payload(await request("/tournaments?limit=20"));
  const listedTournaments = publicTournaments.items ?? [];
  assert(listedTournaments.length > 0, "No public tournaments returned.");
  assert(!listedTournaments.some((tournament) => tournament.slug === "hidden-draft-badminton-event"), "Draft tournament leaked into public listing.");
  assert(!listedTournaments.some((tournament) => tournament.slug === "archived-cricket-trial"), "Archived tournament leaked into public listing.");
  log("public discovery visibility checks passed");

  let openSinglesDetail = payload(await request("/tournaments/chennai-junior-swim-meet"));
  let openSinglesCategory = openSinglesDetail.categories.find((category) => (
    category.participant_type === "singles" && category.entry_fee_amount > 0
  ));
  assert(openSinglesCategory, "Open paid singles seed category not found.");
  let registrationTournamentOrganizerToken = null;

  const wrongCategoryDetail = payload(await request("/tournaments/hyderabad-corporate-cricket-cup"));
  const wrongCategory = wrongCategoryDetail.categories[0];
  assert(wrongCategory?.id, "Wrong-category fixture data missing.");

  const organizerToken = await login(seedOrganizer);
  const seedPlayerToken = await login(seedPlayer);
  const adminToken = await login(seedAdmin);

  const unauthOrganizer = await request("/organizer/dashboard", { allowFailure: true });
  assert(unauthOrganizer.response.status === 401, `Unauthenticated organizer access expected 401, got ${unauthOrganizer.response.status}.`);
  const playerOrganizer = await request("/organizer/dashboard", {
    token: seedPlayerToken,
    allowFailure: true
  });
  assert(playerOrganizer.response.status === 403, `Player organizer access expected 403, got ${playerOrganizer.response.status}.`);
  log("auth and role checks passed");

  const playerAdmin = await request("/admin/dashboard", {
    token: seedPlayerToken,
    allowFailure: true
  });
  assert(playerAdmin.response.status === 403, `Player admin access expected 403, got ${playerAdmin.response.status}.`);
  const organizerAdmin = await request("/admin/dashboard", {
    token: organizerToken,
    allowFailure: true
  });
  assert(organizerAdmin.response.status === 403, `Organizer admin access expected 403, got ${organizerAdmin.response.status}.`);
  const adminDashboard = payload(await request("/admin/dashboard", { token: adminToken }));
  assert(adminDashboard.total_users >= 3, "Admin dashboard did not return platform user counts.");
  const adminUsers = payload(await request("/admin/users?limit=5", { token: adminToken }));
  const adminUsersPayload = JSON.stringify(adminUsers).toLowerCase();
  assert(!adminUsersPayload.includes("password_hash"), "Admin users list leaked password hash field.");
  assert(!adminUsersPayload.includes("token_hash"), "Admin users list leaked token hash field.");
  const playerAdminExport = await request("/admin/users/export.csv", {
    token: seedPlayerToken,
    allowFailure: true
  });
  assert(playerAdminExport.response.status === 403, "Player accessed admin users CSV export.");
  const adminUsersExport = await request("/admin/users/export.csv?role=ADMIN", { token: adminToken });
  assertCsvExport(adminUsersExport, "id");
  assert(adminUsersExport.text.includes("roles"), "Admin users CSV did not include roles header.");
  assertNoForbiddenExportMarkers(adminUsersExport.text, "Admin users");
  const adminExportAudit = payload(await request("/admin/audit-events?entity_type=admin_export&action=admin.export_users&limit=20", {
    token: adminToken
  }));
  assert(adminExportAudit.items.length > 0, "Admin users export audit event was not recorded.");
  log("read-only admin authorization and user privacy checks passed");

  const organizerTournaments = payload(await request("/organizer/tournaments?status=published&limit=12", {
    token: organizerToken
  }));
  const ownedPublishedTournament = (organizerTournaments.items ?? []).find((tournament) => tournament.status === "published");
  assert(ownedPublishedTournament, "Seed organizer has no owned published tournament.");

  const verificationOrganizer = await signupOrganizer("verification");
  assert(verificationOrganizer.organizerProfile?.verification_status === "PENDING", "New organizer did not start pending verification.");
  const playerVerifyOrganizer = await request(`/admin/organizers/${verificationOrganizer.organizerProfile.id}/verify`, {
    method: "PATCH",
    token: seedPlayerToken,
    allowFailure: true
  });
  assert(playerVerifyOrganizer.response.status === 403, "Player verified an organizer through admin endpoint.");
  const organizerVerifyOrganizer = await request(`/admin/organizers/${verificationOrganizer.organizerProfile.id}/verify`, {
    method: "PATCH",
    token: verificationOrganizer.token,
    allowFailure: true
  });
  assert(organizerVerifyOrganizer.response.status === 403, "Organizer verified themselves through admin endpoint.");
  const organizerDetailBefore = payload(await request(`/admin/organizers/${verificationOrganizer.organizerProfile.id}`, {
    token: adminToken
  }));
  assert(organizerDetailBefore.verification_status === "pending", "Admin organizer detail did not show pending verification.");
  const verifiedOrganizer = payload(await request(`/admin/organizers/${verificationOrganizer.organizerProfile.id}/verify`, {
    method: "PATCH",
    token: adminToken
  }));
  assert(verifiedOrganizer.verification_status === "verified", "Admin verify action did not mark organizer verified.");
  const verifiedOrganizerTournament = payload(await request("/organizer/tournaments", {
    method: "POST",
    token: verificationOrganizer.token,
    body: {
      title: `MVP Verified Organizer Event ${runId}`,
      short_description: "Draft created after admin verification.",
      description: "Used to verify that admin-approved organizers can publish.",
      sport_id: ownedPublishedTournament.sport.id,
      city_id: ownedPublishedTournament.city.id,
      starts_at: new Date(Date.now() + 24 * 86400000).toISOString(),
      ends_at: new Date(Date.now() + 25 * 86400000).toISOString(),
      registration_opens_at: new Date(Date.now() + 3 * 86400000).toISOString(),
      registration_closes_at: new Date(Date.now() + 20 * 86400000).toISOString()
    }
  }));
  await request(`/organizer/tournaments/${verifiedOrganizerTournament.id}/categories`, {
    method: "POST",
    token: verificationOrganizer.token,
    body: {
      name: `MVP Verification Singles ${runId}`,
      code: `mvp-verification-singles-${runId}`,
      format_type: "KNOCKOUT",
      participant_type: "SINGLES",
      gender_type: "OPEN",
      entry_fee_amount: 0,
      entry_fee_currency: "INR",
      capacity: 8
    }
  });
  const publishedVerifiedOrganizerTournament = payload(await request(`/organizer/tournaments/${verifiedOrganizerTournament.id}/publish`, {
    method: "PATCH",
    token: verificationOrganizer.token
  }));
  assert(publishedVerifiedOrganizerTournament.status === "published", "Verified organizer could not publish a valid tournament.");

  const rejectionOrganizer = await signupOrganizer("verification-reject");
  const rejectedOrganizer = payload(await request(`/admin/organizers/${rejectionOrganizer.organizerProfile.id}/reject`, {
    method: "PATCH",
    token: adminToken,
    body: { reason: "Smoke verification rejection" }
  }));
  assert(rejectedOrganizer.verification_status === "rejected", "Admin reject action did not reject organizer.");
  const resetOrganizer = payload(await request(`/admin/organizers/${rejectionOrganizer.organizerProfile.id}/reset-verification`, {
    method: "PATCH",
    token: adminToken
  }));
  assert(resetOrganizer.verification_status === "pending", "Admin reset action did not return organizer to pending.");
  const organizerVerificationAudit = payload(await request("/admin/audit-events?entity_type=organizer_profile&action=admin.organizer_verified&limit=20", {
    token: adminToken
  }));
  assert(
    organizerVerificationAudit.items.some((event) => event.entity_id === verificationOrganizer.organizerProfile.id),
    "Admin organizer verification audit event was not recorded."
  );
  log("admin organizer verification actions passed");

  const draftTournament = payload(await request("/organizer/tournaments", {
    method: "POST",
    token: organizerToken,
    body: {
      title: `MVP Smoke Draft ${runId}`,
      short_description: "Draft tournament created by the MVP smoke script.",
      description: "Used to verify draft visibility and organizer CRUD behavior.",
      sport_id: ownedPublishedTournament.sport.id,
      city_id: ownedPublishedTournament.city.id,
      starts_at: new Date(Date.now() + 20 * 86400000).toISOString(),
      ends_at: new Date(Date.now() + 21 * 86400000).toISOString(),
      registration_opens_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      registration_closes_at: new Date(Date.now() + 15 * 86400000).toISOString()
    }
  }));
  const editedDraft = payload(await request(`/organizer/tournaments/${draftTournament.id}`, {
    method: "PATCH",
    token: organizerToken,
    body: { title: `MVP Smoke Draft Edited ${runId}` }
  }));
  assert(editedDraft.title.includes("Edited"), "Draft tournament edit did not persist.");
  const draftPublic = await request(`/tournaments/${draftTournament.slug}`, { allowFailure: true });
  assert(draftPublic.response.status === 404, "Draft tournament detail leaked publicly.");
  const unverifiedPublish = await request(`/organizer/tournaments/${draftTournament.id}/publish`, {
    method: "PATCH",
    token: organizerToken,
    allowFailure: true
  });
  assert(unverifiedPublish.response.status === 403, "Unverified organizer publish guard did not reject.");
  log("organizer CRUD and draft visibility checks passed");

  const registrationTournament = payload(await request("/organizer/tournaments", {
    method: "POST",
    token: verificationOrganizer.token,
    body: {
      title: `MVP Smoke Registration Event ${runId}`,
      short_description: "Published tournament created by the MVP smoke script for registration checks.",
      description: "Used to verify player registration, organizer review, payments, and exports against fresh registration dates.",
      sport_id: ownedPublishedTournament.sport.id,
      city_id: ownedPublishedTournament.city.id,
      starts_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      ends_at: new Date(Date.now() + 31 * 86400000).toISOString(),
      registration_opens_at: new Date(Date.now() - 86400000).toISOString(),
      registration_closes_at: new Date(Date.now() + 20 * 86400000).toISOString()
    }
  }));
  const registrationCategory = payload(await request(`/organizer/tournaments/${registrationTournament.id}/categories`, {
    method: "POST",
    token: verificationOrganizer.token,
    body: {
      name: `MVP Smoke Paid Singles ${runId}`,
      code: `mvp-smoke-paid-singles-${runId}`,
      format_type: "KNOCKOUT",
      participant_type: "SINGLES",
      gender_type: "OPEN",
      entry_fee_amount: 750,
      entry_fee_currency: "INR",
      capacity: 20
    }
  }));
  await request(`/organizer/tournaments/${registrationTournament.id}/publish`, {
    method: "PATCH",
    token: verificationOrganizer.token
  });
  openSinglesDetail = payload(await request(`/tournaments/${registrationTournament.slug}`));
  openSinglesCategory = openSinglesDetail.categories.find((category) => category.id === registrationCategory.id);
  assert(openSinglesCategory, "Fresh paid singles smoke category not found publicly.");
  registrationTournamentOrganizerToken = verificationOrganizer.token;

  const registrationPlayer = await signupPlayer("registration");
  const registration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: registrationPlayer.token,
    body: {
      tournament_category_id: openSinglesCategory.id,
      player_name: `Registration Player ${runId}`,
      phone: "+919999991111",
      notes: "Smoke registration"
    }
  }));
  const duplicateRegistration = await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: registrationPlayer.token,
    body: { tournament_category_id: openSinglesCategory.id },
    allowFailure: true
  });
  assert(duplicateRegistration.response.status === 409, "Duplicate active registration was not blocked.");

  const invalidCategoryPlayer = await signupPlayer("invalid-category");
  const invalidCategory = await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: invalidCategoryPlayer.token,
    body: { tournament_category_id: wrongCategory.id },
    allowFailure: true
  });
  assert(invalidCategory.response.status === 400, "Invalid tournament/category combination was not rejected.");

  const otherPlayer = await signupPlayer("other-user");
  const otherView = await request(`/registrations/${registration.id}`, {
    token: otherPlayer.token,
    allowFailure: true
  });
  assert(otherView.response.status === 403, "Player viewed another user's registration.");
  const otherCancel = await request(`/registrations/${registration.id}/cancel`, {
    method: "PATCH",
    token: otherPlayer.token,
    allowFailure: true
  });
  assert(otherCancel.response.status === 403, "Player cancelled another user's registration.");
  const ownRegistrations = payload(await request("/me/registrations", { token: registrationPlayer.token }));
  assert(ownRegistrations.some((item) => item.id === registration.id), "Own registration did not appear in account list.");
  const cancelledRegistration = payload(await request(`/registrations/${registration.id}/cancel`, {
    method: "PATCH",
    token: registrationPlayer.token
  }));
  assert(cancelledRegistration.status === "cancelled", "Pending registration was not cancelled.");
  log("player registration checks passed");

  const approvalPlayer = await signupPlayer("approval");
  const approvalRegistration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: approvalPlayer.token,
    body: { tournament_category_id: openSinglesCategory.id }
  }));
  const approvedRegistration = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${approvalRegistration.id}/approve`, {
    method: "PATCH",
    token: registrationTournamentOrganizerToken
  }));
  assert(approvedRegistration.status === "confirmed", "Organizer approval did not confirm registration.");
  assert(approvedRegistration.participant_id, "Organizer approval did not create participant.");

  const rejectionPlayer = await signupPlayer("rejection");
  const rejectionRegistration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: rejectionPlayer.token,
    body: { tournament_category_id: openSinglesCategory.id }
  }));
  const rejectedRegistration = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${rejectionRegistration.id}/reject`, {
    method: "PATCH",
    token: registrationTournamentOrganizerToken,
    body: { reason: "Smoke rejection" }
  }));
  assert(rejectedRegistration.status === "rejected", "Organizer rejection did not reject registration.");
  log("organizer registration review checks passed");

  const paymentPlayer = await signupPlayer("payment");
  const paymentRegistration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: paymentPlayer.token,
    body: {
      tournament_category_id: openSinglesCategory.id,
      player_name: `Payment Player ${runId}`
    }
  }));
  assert(paymentRegistration.payment_status === "pending_offline", "Paid category registration did not default to pending offline payment.");
  assert(paymentRegistration.payment?.amount === openSinglesCategory.entry_fee_amount, "Registration payment summary amount did not match category fee.");
  const playerPaymentUpdate = await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${paymentRegistration.id}/payment`, {
    method: "PATCH",
    token: paymentPlayer.token,
    body: { status: "paid" },
    allowFailure: true
  });
  assert(playerPaymentUpdate.response.status === 403, "Player updated their own payment status through organizer endpoint.");
  const paidPayment = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${paymentRegistration.id}/payment`, {
    method: "PATCH",
    token: registrationTournamentOrganizerToken,
    body: {
      status: "paid",
      reference: `SMOKE-${runId}`,
      internal_notes: "Do not expose this internal smoke payment note.",
      paid_at: new Date().toISOString()
    }
  }));
  assert(paidPayment.payment_status === "paid", "Organizer payment update did not mark payment paid.");
  assert(paidPayment.reference === `SMOKE-${runId}`, "Organizer payment reference did not persist.");
  const organizerPayments = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/payments?status=paid&search=SMOKE-${runId}`, {
    token: registrationTournamentOrganizerToken
  }));
  assert(organizerPayments.some((item) => item.registration_id === paymentRegistration.id), "Organizer payment list did not include the paid registration.");
  const paymentDetail = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/payments/${paymentRegistration.id}`, {
    token: registrationTournamentOrganizerToken
  }));
  assert(paymentDetail.registration_id === paymentRegistration.id, "Organizer payment diagnostics did not load.");
  assert(Array.isArray(paymentDetail.events), "Organizer payment diagnostics did not include event history.");
  const overRefund = await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${paymentRegistration.id}/refunds`, {
    method: "POST",
    token: registrationTournamentOrganizerToken,
    body: {
      amount: paidPayment.amount + 1,
      status: "manual_recorded"
    },
    allowFailure: true
  });
  assert(overRefund.response.status === 400, "Refund amount above paid amount was not rejected.");
  const playerRefund = await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${paymentRegistration.id}/refunds`, {
    method: "POST",
    token: paymentPlayer.token,
    body: {
      amount: paidPayment.amount,
      status: "manual_recorded"
    },
    allowFailure: true
  });
  assert(playerRefund.response.status === 403, "Player created a refund through organizer endpoint.");
  const refundDetail = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/${paymentRegistration.id}/refunds`, {
    method: "POST",
    token: registrationTournamentOrganizerToken,
    body: {
      amount: paidPayment.amount,
      status: "manual_recorded",
      reason: "Smoke refund",
      internal_notes: "Do not expose this internal smoke refund note."
    }
  }));
  assert(refundDetail.refund_count >= 1, "Organizer refund record was not created.");
  assert(refundDetail.payment_status === "refunded", "Full manual refund did not update payment summary to refunded.");
  const paymentPlayerRegistrations = payload(await request("/me/registrations", { token: paymentPlayer.token }));
  const paymentPlayerRegistration = paymentPlayerRegistrations.find((item) => item.id === paymentRegistration.id);
  assert(paymentPlayerRegistration?.payment_status === "refunded", "Player registration list did not show refunded payment status.");
  assert(paymentPlayerRegistration?.payment?.refund_count >= 1, "Player payment summary did not include safe refund count.");
  const playerPaymentPayload = JSON.stringify(paymentPlayerRegistration).toLowerCase();
  assert(!playerPaymentPayload.includes("internal smoke payment note"), "Player payment payload leaked organizer internal notes.");
  assert(!playerPaymentPayload.includes("internal smoke refund note"), "Player payment payload leaked internal refund notes.");
  const adminPaymentList = payload(await request(`/admin/payments?registration_id=${paymentRegistration.id}`, {
    token: adminToken
  }));
  const adminPayment = adminPaymentList.items.find((item) => item.registration_id === paymentRegistration.id);
  assert(adminPayment, "Admin payment list did not include the smoke payment.");
  const adminPaymentDetail = payload(await request(`/admin/payments/${adminPayment.id}`, {
    token: adminToken
  }));
  const adminPaymentPayload = JSON.stringify(adminPaymentDetail).toLowerCase();
  assert(!adminPaymentPayload.includes("internal smoke payment note"), "Admin payment diagnostics leaked internal payment notes.");
  assert(!adminPaymentPayload.includes("internal smoke refund note"), "Admin payment diagnostics leaked internal refund notes.");
  assert(!adminPaymentPayload.includes("razorpay_key_secret"), "Admin payment diagnostics leaked a Razorpay secret marker.");
  const adminPaymentsExport = await request(`/admin/payments/export.csv?registration_id=${paymentRegistration.id}`, {
    token: adminToken
  });
  assertCsvExport(adminPaymentsExport, "paymentRecordId");
  assert(adminPaymentsExport.text.includes(paymentRegistration.id), "Admin payments CSV did not include smoke registration.");
  assertNoForbiddenExportMarkers(adminPaymentsExport.text, "Admin payments");
  const organizerPaymentExport = await request(`/organizer/tournaments/${openSinglesDetail.id}/payments/export.csv?search=${encodeURIComponent(`SMOKE-${runId}`)}`, {
    token: registrationTournamentOrganizerToken
  });
  assertCsvExport(organizerPaymentExport, "registrationId");
  assertNoForbiddenExportMarkers(organizerPaymentExport.text, "Organizer payments");
  assert(!organizerPaymentExport.text.toLowerCase().includes("internal smoke payment note"), "Organizer payment export leaked internal notes.");
  const organizerRegistrationExport = await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/export.csv?category_id=${openSinglesCategory.id}`, {
    token: registrationTournamentOrganizerToken
  });
  assertCsvExport(organizerRegistrationExport, "registrationId");
  assertNoForbiddenExportMarkers(organizerRegistrationExport.text, "Organizer registrations");
  const otherOrganizerExport = await request(`/organizer/tournaments/${openSinglesDetail.id}/registrations/export.csv`, {
    token: organizerToken,
    allowFailure: true
  });
  assert(otherOrganizerExport.response.status === 404, "Organizer exported another organizer's tournament registrations.");
  const organizerExportAudit = payload(await request("/admin/audit-events?entity_type=tournament&action=organizer.export_payments&limit=20", {
    token: adminToken
  }));
  assert(
    organizerExportAudit.items.some((event) => event.entity_id === openSinglesDetail.id),
    "Organizer payment export audit event was not recorded."
  );
  const adminNotifications = payload(await request("/admin/notifications?limit=10", { token: adminToken }));
  const notificationWithEmail = adminNotifications.items.find((item) => item.recipient_email);
  if (notificationWithEmail) {
    assert(notificationWithEmail.recipient_email.includes("***"), "Admin notifications list did not mask recipient email.");
  }
  const adminNotificationsExport = await request("/admin/notifications/export.csv", { token: adminToken });
  assertCsvExport(adminNotificationsExport, "recipientEmail");
  assertNoForbiddenExportMarkers(adminNotificationsExport.text, "Admin notifications");
  if (notificationWithEmail) {
    assert(adminNotificationsExport.text.includes("***"), "Admin notification export did not mask recipient emails.");
  }
  const pendingNotification = adminNotifications.items.find((item) => item.status === "pending");
  if (pendingNotification) {
    const playerSkipNotification = await request(`/admin/notifications/${pendingNotification.id}/skip`, {
      method: "PATCH",
      token: paymentPlayer.token,
      body: { reason: "Player should not skip notifications" },
      allowFailure: true
    });
    assert(playerSkipNotification.response.status === 403, "Player skipped a notification through admin endpoint.");
    const organizerRetryNotification = await request(`/admin/notifications/${pendingNotification.id}/retry`, {
      method: "PATCH",
      token: organizerToken,
      allowFailure: true
    });
    assert(organizerRetryNotification.response.status === 403, "Organizer retried a notification through admin endpoint.");
    const skippedNotification = payload(await request(`/admin/notifications/${pendingNotification.id}/skip`, {
      method: "PATCH",
      token: adminToken,
      body: { reason: "Smoke notification skip" }
    }));
    assert(skippedNotification.status === "skipped", "Admin skip action did not mark notification skipped.");
    const retriedNotification = payload(await request(`/admin/notifications/${pendingNotification.id}/retry`, {
      method: "PATCH",
      token: adminToken
    }));
    assert(retriedNotification.status === "pending", "Admin retry action did not return notification to pending.");
    const notificationAudit = payload(await request("/admin/audit-events?entity_type=notification_outbox&action=admin.notification_retry_requested&limit=20", {
      token: adminToken
    }));
    assert(
      notificationAudit.items.some((event) => event.entity_id === pendingNotification.id),
      "Admin notification retry audit event was not recorded."
    );
  }
  log("manual payment and refund tracking checks passed");

  const onlinePaymentPlayer = await signupPlayer("online-payment");
  const onlinePaymentRegistration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: onlinePaymentPlayer.token,
    body: {
      tournament_category_id: openSinglesCategory.id,
      player_name: `Online Payment Player ${runId}`
    }
  }));
  const onlineIntentAttempt = await request(`/me/registrations/${onlinePaymentRegistration.id}/payment-intent`, {
    method: "POST",
    token: onlinePaymentPlayer.token,
    allowFailure: true
  });
  if (onlineIntentAttempt.response.ok) {
    const onlineIntent = payload(onlineIntentAttempt);
    assert(onlineIntent.status === "requires_action", "Mock payment intent did not require action.");
    assert(onlineIntent.provider === "mock", "Mock payment intent did not use the mock provider.");
    assert(onlineIntent.checkout_url, "Mock payment intent did not return a checkout URL.");

    const otherPaymentIntent = await request(`/me/registrations/${onlinePaymentRegistration.id}/payment-intent`, {
      method: "POST",
      token: otherPlayer.token,
      allowFailure: true
    });
    assert([403, 404].includes(otherPaymentIntent.response.status), "Player created payment intent for another user's registration.");

    const completedIntent = payload(await request("/payments/mock/complete", {
      method: "POST",
      token: onlinePaymentPlayer.token,
      body: { payment_intent_id: onlineIntent.id }
    }));
    assert(completedIntent.status === "succeeded", "Mock payment completion did not mark the intent succeeded.");
    assert(completedIntent.event_count >= 2, "Mock payment lifecycle events were not recorded.");

    const onlinePaymentRegistrations = payload(await request("/me/registrations", { token: onlinePaymentPlayer.token }));
    const onlinePaidRegistration = onlinePaymentRegistrations.find((item) => item.id === onlinePaymentRegistration.id);
    assert(onlinePaidRegistration?.payment_status === "paid", "Mock payment completion did not mark player payment paid.");
    assert(onlinePaidRegistration?.payment?.provider === "mock", "Player payment summary did not show mock provider.");

    const organizerOnlinePayments = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/payments?status=paid&search=Online%20Payment%20Player`, {
      token: registrationTournamentOrganizerToken
    }));
    const organizerOnlinePayment = organizerOnlinePayments.find((item) => item.registration_id === onlinePaymentRegistration.id);
    assert(organizerOnlinePayment?.payment_provider === "mock", "Organizer payment list did not show mock provider.");
    assert(organizerOnlinePayment?.latest_intent_status === "succeeded", "Organizer payment list did not show succeeded mock intent.");
    log("mock online payment intent and completion checks passed");
  } else {
    assert(onlineIntentAttempt.response.status === 400, "Online payment intent failed for an unexpected reason.");
    log("mock online payment checks skipped because PAYMENT_PROVIDER is not mock");
  }

  const smokeCategory = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/categories`, {
    method: "POST",
    token: organizerToken,
    body: {
      name: `MVP Smoke Teams ${runId}`,
      code: `mvp-smoke-teams-${runId}`,
      format_type: "KNOCKOUT",
      participant_type: "TEAM",
      gender_type: "OPEN",
      entry_fee_amount: 0,
      entry_fee_currency: "INR",
      capacity: 8
    }
  }));

  const freeSmokeCategory = payload(await request(`/organizer/tournaments/${openSinglesDetail.id}/categories`, {
    method: "POST",
    token: registrationTournamentOrganizerToken,
    body: {
      name: `MVP Smoke Free ${runId}`,
      code: `mvp-smoke-free-${runId}`,
      format_type: "KNOCKOUT",
      participant_type: "SINGLES",
      gender_type: "OPEN",
      entry_fee_amount: 0,
      entry_fee_currency: "INR",
      capacity: 8
    }
  }));
  const freePaymentPlayer = await signupPlayer("free-payment");
  const freePaymentRegistration = payload(await request(`/tournaments/${openSinglesDetail.slug}/registrations`, {
    method: "POST",
    token: freePaymentPlayer.token,
    body: {
      tournament_category_id: freeSmokeCategory.id,
      player_name: `Free Payment Player ${runId}`
    }
  }));
  const freePaymentIntent = await request(`/me/registrations/${freePaymentRegistration.id}/payment-intent`, {
    method: "POST",
    token: freePaymentPlayer.token,
    allowFailure: true
  });
  assert(freePaymentIntent.response.status === 400, "Free registration created an online payment intent.");

  const manualParticipant = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/participants`, {
    method: "POST",
    token: organizerToken,
    body: {
      tournament_category_id: smokeCategory.id,
      display_name: `Manual Participant ${runId}`,
      email: `manual-participant-${runId}@example.com`,
      phone: "+919999992222"
    }
  }));
  const updatedParticipant = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/participants/${manualParticipant.id}`, {
    method: "PATCH",
    token: organizerToken,
    body: { display_name: `Manual Participant Edited ${runId}` }
  }));
  assert(updatedParticipant.display_name.includes("Edited"), "Manual participant update did not persist.");
  const withdrawnParticipant = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/participants/${manualParticipant.id}`, {
    method: "DELETE",
    token: organizerToken
  }));
  assert(withdrawnParticipant.status === "withdrawn", "Manual participant was not withdrawn.");

  const teams = [];
  for (let index = 1; index <= 4; index += 1) {
    const team = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams`, {
      method: "POST",
      token: organizerToken,
      body: {
        tournament_category_id: smokeCategory.id,
        name: `MVP Team ${index} ${runId}`,
        seed: index
      }
    }));
    teams.push(team);
  }
  const updatedTeam = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams/${teams[0].id}`, {
    method: "PATCH",
    token: organizerToken,
    body: { name: `MVP Team 1 Edited ${runId}` }
  }));
  assert(updatedTeam.name.includes("Edited"), "Team update did not persist.");
  const member = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams/${teams[0].id}/members`, {
    method: "POST",
    token: organizerToken,
    body: {
      display_name: `Manual Member ${runId}`,
      email: `manual-member-${runId}@example.com`,
      phone: "+919999993333",
      role: "PLAYER"
    }
  }));
  const updatedMember = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams/${teams[0].id}/members/${member.id}`, {
    method: "PATCH",
    token: organizerToken,
    body: { role: "CAPTAIN" }
  }));
  assert(updatedMember.role === "captain", "Team member role update did not persist.");
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams/${teams[0].id}/members/${member.id}`, {
    method: "DELETE",
    token: organizerToken
  });
  const teamSummary = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/teams/${teams[0].id}`, {
    token: organizerToken
  }));
  assert(!teamSummary.members.some((item) => item.id === member.id), "Team member removal did not persist.");
  log("roster, participant, team, and member checks passed");

  const knockoutFixture = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/categories/${smokeCategory.id}/fixtures/generate`, {
    method: "POST",
    token: organizerToken,
    body: {
      format: "KNOCKOUT",
      entrant_type: "TEAM",
      name: `MVP Knockout ${runId}`,
      replace_existing: false
    }
  }));
  const duplicateFixture = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/categories/${smokeCategory.id}/fixtures/generate`, {
    method: "POST",
    token: organizerToken,
    body: {
      format: "KNOCKOUT",
      entrant_type: "TEAM",
      name: `MVP Knockout Duplicate ${runId}`,
      replace_existing: false
    },
    allowFailure: true
  });
  assert(duplicateFixture.response.status === 409, "Unsafe duplicate fixture generation was not blocked.");
  log("fixture generation duplicate guard passed");

  const knockoutDetail = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}`, {
    token: organizerToken
  }));
  const firstKnockoutMatch = knockoutDetail.rounds[0].matches[0];
  const secondKnockoutMatch = knockoutDetail.rounds[0].matches[1];
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${firstKnockoutMatch.id}`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scheduled_at: new Date(Date.now() + 3 * 86400000).toISOString(),
      venue_name: "Smoke Arena",
      court_name: "Court 1",
      notes: "Internal schedule note",
      status: "SCHEDULED"
    }
  });

  const scheduledDetail = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}`, {
    token: organizerToken
  }));
  const scheduledFirstMatch = scheduledDetail.rounds[0].matches[0];
  const firstEntrants = scheduledFirstMatch.entrants.filter((entrant) => !entrant.is_bye);
  const knockoutDraw = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${scheduledFirstMatch.id}/complete`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: firstEntrants.map((entrant) => ({ match_entrant_id: entrant.id, score: 5 })),
      allow_draw: true
    },
    allowFailure: true
  });
  assert(knockoutDraw.response.status === 400, "Knockout draw completion was not rejected.");
  const negativeScore = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${scheduledFirstMatch.id}/score`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: firstEntrants.map((entrant) => ({ match_entrant_id: entrant.id, score: entrant.slot_number === 1 ? -1 : 0 }))
    },
    allowFailure: true
  });
  assert(negativeScore.response.status === 400, "Negative score was not rejected.");
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${scheduledFirstMatch.id}/complete`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: firstEntrants.map((entrant, index) => ({ match_entrant_id: entrant.id, score: index === 0 ? 11 : 7 })),
      winner_match_entrant_id: firstEntrants[0].id,
      result_notes: "Internal result note"
    }
  });
  const advancedKnockout = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}`, {
    token: organizerToken
  }));
  const finalRound = advancedKnockout.rounds.find((round) => round.round_number === 2);
  assert(finalRound?.matches[0].entrants.some((entrant) => entrant.display_name === firstEntrants[0].display_name), "Knockout winner did not advance.");
  const completedAdvancedMatch = advancedKnockout.rounds
    .flatMap((round) => round.matches)
    .find((match) => match.status === "completed" && match.entrants.some((entrant) => entrant.display_name === firstEntrants[0].display_name));
  assert(completedAdvancedMatch, "Completed knockout match was not found after advancement.");
  const unsafeReopen = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${completedAdvancedMatch.id}/reopen`, {
    method: "PATCH",
    token: organizerToken,
    allowFailure: true
  });
  assert([400, 409].includes(unsafeReopen.response.status), "Unsafe knockout reopen was not blocked.");

  const secondEntrants = secondKnockoutMatch.entrants.filter((entrant) => !entrant.is_bye);
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${secondKnockoutMatch.id}/complete`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: secondEntrants.map((entrant, index) => ({ match_entrant_id: entrant.id, score: index === 0 ? 9 : 11 })),
      winner_match_entrant_id: secondEntrants[1].id
    }
  });
  log("knockout scoring and advancement checks passed");

  const roundRobinFixture = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/categories/${smokeCategory.id}/fixtures/generate`, {
    method: "POST",
    token: organizerToken,
    body: {
      format: "ROUND_ROBIN",
      entrant_type: "TEAM",
      name: `MVP Round Robin ${runId}`,
      replace_existing: false
    }
  }));
  const roundRobinDetail = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${roundRobinFixture.id}`, {
    token: organizerToken
  }));
  const roundRobinMatch = roundRobinDetail.rounds[0].matches[0];
  const roundRobinEntrants = roundRobinMatch.entrants.filter((entrant) => !entrant.is_bye);
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${roundRobinFixture.id}/matches/${roundRobinMatch.id}/complete`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: roundRobinEntrants.map((entrant, index) => ({ match_entrant_id: entrant.id, score: index === 0 ? 8 : 4 })),
      winner_match_entrant_id: roundRobinEntrants[0].id
    }
  });
  const roundRobinResults = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${roundRobinFixture.id}/results`, {
    token: organizerToken
  }));
  assert(roundRobinResults.standings.length >= 2, "Round-robin standings were not calculated.");
  assert(roundRobinResults.standings[0].points >= roundRobinResults.standings[1].points, "Round-robin standings were not sorted.");
  log("round-robin standings checks passed");

  const playerFixtureAccess = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}`, {
    token: seedPlayerToken,
    allowFailure: true
  });
  assert(playerFixtureAccess.response.status === 403, "Player accessed organizer fixture endpoint.");

  const publicBeforePublish = payload(await request(`/tournaments/${ownedPublishedTournament.slug}/fixtures`));
  assert(!publicBeforePublish.some((fixture) => fixture.id === knockoutFixture.id), "Fixture was public before result publishing.");
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/publish-results`, {
    method: "PATCH",
    token: organizerToken
  });
  const publicAfterPublish = payload(await request(`/tournaments/${ownedPublishedTournament.slug}/fixtures`));
  const publishedFixture = publicAfterPublish.find((fixture) => fixture.id === knockoutFixture.id);
  assert(publishedFixture, "Published fixture did not appear publicly.");
  const publicPayload = JSON.stringify(publishedFixture).toLowerCase();
  for (const marker of publicForbiddenMarkers) {
    assert(!publicPayload.includes(marker), `Public result payload leaked forbidden marker: ${marker}`);
  }
  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/unpublish-results`, {
    method: "PATCH",
    token: organizerToken
  });
  const publicAfterUnpublish = payload(await request(`/tournaments/${ownedPublishedTournament.slug}/fixtures`));
  assert(!publicAfterUnpublish.some((fixture) => fixture.id === knockoutFixture.id), "Fixture stayed public after unpublish.");

  await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/archive`, {
    method: "PATCH",
    token: organizerToken
  });
  const archivedSchedule = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${scheduledFirstMatch.id}`, {
    method: "PATCH",
    token: organizerToken,
    body: { status: "POSTPONED" },
    allowFailure: true
  });
  assert(archivedSchedule.response.status === 400, "Archived fixture scheduling was not rejected.");
  const archivedScore = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/matches/${scheduledFirstMatch.id}/score`, {
    method: "PATCH",
    token: organizerToken,
    body: {
      scores: firstEntrants.map((entrant) => ({ match_entrant_id: entrant.id, score: 1 }))
    },
    allowFailure: true
  });
  assert(archivedScore.response.status === 400, "Archived fixture scoring was not rejected.");
  const archivedPublish = await request(`/organizer/tournaments/${ownedPublishedTournament.id}/fixtures/${knockoutFixture.id}/publish-results`, {
    method: "PATCH",
    token: organizerToken,
    allowFailure: true
  });
  assert(archivedPublish.response.status === 400, "Archived fixture publishing was not rejected.");
  log("public result publishing and archive guards passed");

  const deactivatedCategory = payload(await request(`/organizer/tournaments/${ownedPublishedTournament.id}/categories/${smokeCategory.id}`, {
    method: "DELETE",
    token: organizerToken
  }));
  assert(deactivatedCategory.status === "inactive", "Category deactivation did not return inactive.");

  console.log(JSON.stringify({
    status: "mvp_smoke_ok",
    run_id: runId,
    tournament_id: ownedPublishedTournament.id,
    draft_tournament_id: draftTournament.id,
    knockout_fixture_id: knockoutFixture.id,
    round_robin_fixture_id: roundRobinFixture.id,
    public_privacy_markers_checked: publicForbiddenMarkers.length
  }));
}

main().catch((error) => {
  console.error(`mvp-smoke failed: ${error.message}`);
  process.exit(1);
});
