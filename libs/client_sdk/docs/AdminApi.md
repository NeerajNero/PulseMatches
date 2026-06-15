# AdminApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminControllerExportAuditEvents**](AdminApi.md#admincontrollerexportauditevents) | **GET** /admin/audit-events/export.csv | Export sanitized audit event summary as CSV |
| [**adminControllerExportNotifications**](AdminApi.md#admincontrollerexportnotifications) | **GET** /admin/notifications/export.csv | Export safe notification outbox summary as CSV |
| [**adminControllerExportOrganizers**](AdminApi.md#admincontrollerexportorganizers) | **GET** /admin/organizers/export.csv | Export safe organizer verification list as CSV |
| [**adminControllerExportPaymentReport**](AdminApi.md#admincontrollerexportpaymentreport) | **GET** /admin/reports/payments/export.csv | Export platform payment report as CSV |
| [**adminControllerExportPayments**](AdminApi.md#admincontrollerexportpayments) | **GET** /admin/payments/export.csv | Export safe payment overview as CSV |
| [**adminControllerExportReconciliationRuns**](AdminApi.md#admincontrollerexportreconciliationruns) | **GET** /admin/reconciliation-runs/export.csv | Export reconciliation run summaries as CSV |
| [**adminControllerExportRegistrationReport**](AdminApi.md#admincontrollerexportregistrationreport) | **GET** /admin/reports/registrations/export.csv | Export platform registration report as CSV |
| [**adminControllerExportRegistrations**](AdminApi.md#admincontrollerexportregistrations) | **GET** /admin/registrations/export.csv | Export safe registration overview as CSV |
| [**adminControllerExportTournaments**](AdminApi.md#admincontrollerexporttournaments) | **GET** /admin/tournaments/export.csv | Export safe tournament overview as CSV |
| [**adminControllerExportUsers**](AdminApi.md#admincontrollerexportusers) | **GET** /admin/users/export.csv | Export safe platform users list as CSV |
| [**adminControllerFindOrganizerDetail**](AdminApi.md#admincontrollerfindorganizerdetail) | **GET** /admin/organizers/{organizerId} | Get read-only organizer verification detail for support review |
| [**adminControllerFindPaymentDetail**](AdminApi.md#admincontrollerfindpaymentdetail) | **GET** /admin/payments/{paymentRecordId} | Get read-only support diagnostics for one payment record |
| [**adminControllerGetDashboard**](AdminApi.md#admincontrollergetdashboard) | **GET** /admin/dashboard | Get read-only platform support dashboard summary |
| [**adminControllerGetOperationsStatus**](AdminApi.md#admincontrollergetoperationsstatus) | **GET** /admin/operations/status | Get alert-ready platform operations status |
| [**adminControllerGetReportSummary**](AdminApi.md#admincontrollergetreportsummary) | **GET** /admin/reports/summary | Get platform-level support reporting summary |
| [**adminControllerListAuditEvents**](AdminApi.md#admincontrollerlistauditevents) | **GET** /admin/audit-events | List sanitized audit events for support inspection |
| [**adminControllerListNotifications**](AdminApi.md#admincontrollerlistnotifications) | **GET** /admin/notifications | List notification outbox rows for support inspection |
| [**adminControllerListOrganizers**](AdminApi.md#admincontrollerlistorganizers) | **GET** /admin/organizers | List organizer profiles for support inspection |
| [**adminControllerListPayments**](AdminApi.md#admincontrollerlistpayments) | **GET** /admin/payments | List payment records for support inspection |
| [**adminControllerListReconciliationRuns**](AdminApi.md#admincontrollerlistreconciliationruns) | **GET** /admin/reconciliation-runs | List payment reconciliation runs for support inspection |
| [**adminControllerListRegistrations**](AdminApi.md#admincontrollerlistregistrations) | **GET** /admin/registrations | List registrations for support inspection |
| [**adminControllerListTournaments**](AdminApi.md#admincontrollerlisttournaments) | **GET** /admin/tournaments | List tournaments for support inspection |
| [**adminControllerListUsers**](AdminApi.md#admincontrollerlistusers) | **GET** /admin/users | List platform users for support inspection |
| [**adminControllerRejectOrganizer**](AdminApi.md#admincontrollerrejectorganizer) | **PATCH** /admin/organizers/{organizerId}/reject | Reject an organizer verification request with audit trail |
| [**adminControllerResetOrganizerVerification**](AdminApi.md#admincontrollerresetorganizerverification) | **PATCH** /admin/organizers/{organizerId}/reset-verification | Reset organizer verification to pending with audit trail |
| [**adminControllerRetryNotification**](AdminApi.md#admincontrollerretrynotification) | **PATCH** /admin/notifications/{notificationId}/retry | Return a failed or skipped notification to pending for processor retry |
| [**adminControllerSkipNotification**](AdminApi.md#admincontrollerskipnotification) | **PATCH** /admin/notifications/{notificationId}/skip | Mark a pending or failed notification as skipped with audit trail |
| [**adminControllerVerifyOrganizer**](AdminApi.md#admincontrollerverifyorganizer) | **PATCH** /admin/organizers/{organizerId}/verify | Verify an organizer profile with audit trail |



## adminControllerExportAuditEvents

> adminControllerExportAuditEvents(page, limit, search, entityType, action)

Export sanitized audit event summary as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportAuditEventsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // string (optional)
    entityType: entityType_example,
    // string (optional)
    action: action_example,
  } satisfies AdminControllerExportAuditEventsRequest;

  try {
    const data = await api.adminControllerExportAuditEvents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **entityType** | `string` |  | [Optional] [Defaults to `undefined`] |
| **action** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportNotifications

> adminControllerExportNotifications(page, limit, search, type, status, channel)

Export safe notification outbox summary as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportNotificationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // string (optional)
    type: type_example,
    // 'pending' | 'processing' | 'sent' | 'failed' | 'skipped' (optional)
    status: status_example,
    // 'email' (optional)
    channel: channel_example,
  } satisfies AdminControllerExportNotificationsRequest;

  try {
    const data = await api.adminControllerExportNotifications(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **type** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `processing`, `sent`, `failed`, `skipped` |  | [Optional] [Defaults to `undefined`] [Enum: pending, processing, sent, failed, skipped] |
| **channel** | `email` |  | [Optional] [Defaults to `undefined`] [Enum: email] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportOrganizers

> adminControllerExportOrganizers(page, limit, search, verificationStatus)

Export safe organizer verification list as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportOrganizersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'pending' | 'verified' | 'rejected' (optional)
    verificationStatus: verificationStatus_example,
  } satisfies AdminControllerExportOrganizersRequest;

  try {
    const data = await api.adminControllerExportOrganizers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **verificationStatus** | `pending`, `verified`, `rejected` |  | [Optional] [Defaults to `undefined`] [Enum: pending, verified, rejected] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportPaymentReport

> adminControllerExportPaymentReport(page, limit, search, provider, status, tournamentId, registrationId, from, to)

Export platform payment report as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportPaymentReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'manual' | 'mock' | 'razorpay' | 'future_provider' (optional)
    provider: provider_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    registrationId: registrationId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerExportPaymentReportRequest;

  try {
    const data = await api.adminControllerExportPaymentReport(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **provider** | `manual`, `mock`, `razorpay`, `future_provider` |  | [Optional] [Defaults to `undefined`] [Enum: manual, mock, razorpay, future_provider] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportPayments

> adminControllerExportPayments(page, limit, search, provider, status, tournamentId, registrationId, from, to)

Export safe payment overview as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'manual' | 'mock' | 'razorpay' | 'future_provider' (optional)
    provider: provider_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    registrationId: registrationId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerExportPaymentsRequest;

  try {
    const data = await api.adminControllerExportPayments(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **provider** | `manual`, `mock`, `razorpay`, `future_provider` |  | [Optional] [Defaults to `undefined`] [Enum: manual, mock, razorpay, future_provider] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportReconciliationRuns

> adminControllerExportReconciliationRuns(page, limit, search, provider, status, from, to)

Export reconciliation run summaries as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportReconciliationRunsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'manual' | 'mock' | 'razorpay' | 'future_provider' (optional)
    provider: provider_example,
    // 'started' | 'completed' | 'failed' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerExportReconciliationRunsRequest;

  try {
    const data = await api.adminControllerExportReconciliationRuns(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **provider** | `manual`, `mock`, `razorpay`, `future_provider` |  | [Optional] [Defaults to `undefined`] [Enum: manual, mock, razorpay, future_provider] |
| **status** | `started`, `completed`, `failed` |  | [Optional] [Defaults to `undefined`] [Enum: started, completed, failed] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportRegistrationReport

> adminControllerExportRegistrationReport(page, limit, search, status, paymentStatus, tournamentId, from, to)

Export platform registration report as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportRegistrationReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    paymentStatus: paymentStatus_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerExportRegistrationReportRequest;

  try {
    const data = await api.adminControllerExportRegistrationReport(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
| **paymentStatus** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportRegistrations

> adminControllerExportRegistrations(page, limit, search, status, paymentStatus, tournamentId, from, to)

Export safe registration overview as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportRegistrationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    paymentStatus: paymentStatus_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerExportRegistrationsRequest;

  try {
    const data = await api.adminControllerExportRegistrations(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
| **paymentStatus** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportTournaments

> adminControllerExportTournaments(page, limit, search, status, organizerId)

Export safe tournament overview as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportTournamentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'draft' | 'published' | 'archived' | 'blocked' (optional)
    status: status_example,
    // string (optional)
    organizerId: organizerId_example,
  } satisfies AdminControllerExportTournamentsRequest;

  try {
    const data = await api.adminControllerExportTournaments(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `draft`, `published`, `archived`, `blocked` |  | [Optional] [Defaults to `undefined`] [Enum: draft, published, archived, blocked] |
| **organizerId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerExportUsers

> adminControllerExportUsers(page, limit, search, role)

Export safe platform users list as CSV

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerExportUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'PLAYER' | 'ORGANIZER' | 'ADMIN' (optional)
    role: role_example,
  } satisfies AdminControllerExportUsersRequest;

  try {
    const data = await api.adminControllerExportUsers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **role** | `PLAYER`, `ORGANIZER`, `ADMIN` |  | [Optional] [Defaults to `undefined`] [Enum: PLAYER, ORGANIZER, ADMIN] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerFindOrganizerDetail

> AdminOrganizerDetailApiResponseDto adminControllerFindOrganizerDetail(organizerId)

Get read-only organizer verification detail for support review

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerFindOrganizerDetailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    organizerId: organizerId_example,
  } satisfies AdminControllerFindOrganizerDetailRequest;

  try {
    const data = await api.adminControllerFindOrganizerDetail(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **organizerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminOrganizerDetailApiResponseDto**](AdminOrganizerDetailApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerFindPaymentDetail

> AdminPaymentDetailApiResponseDto adminControllerFindPaymentDetail(paymentRecordId)

Get read-only support diagnostics for one payment record

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerFindPaymentDetailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    paymentRecordId: paymentRecordId_example,
  } satisfies AdminControllerFindPaymentDetailRequest;

  try {
    const data = await api.adminControllerFindPaymentDetail(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **paymentRecordId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminPaymentDetailApiResponseDto**](AdminPaymentDetailApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetDashboard

> AdminDashboardApiResponseDto adminControllerGetDashboard()

Get read-only platform support dashboard summary

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetDashboardRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  try {
    const data = await api.adminControllerGetDashboard();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminDashboardApiResponseDto**](AdminDashboardApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetOperationsStatus

> AdminOperationsStatusApiResponseDto adminControllerGetOperationsStatus()

Get alert-ready platform operations status

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetOperationsStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  try {
    const data = await api.adminControllerGetOperationsStatus();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminOperationsStatusApiResponseDto**](AdminOperationsStatusApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetReportSummary

> AdminPlatformReportSummaryApiResponseDto adminControllerGetReportSummary(from, to)

Get platform-level support reporting summary

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetReportSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerGetReportSummaryRequest;

  try {
    const data = await api.adminControllerGetReportSummary(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminPlatformReportSummaryApiResponseDto**](AdminPlatformReportSummaryApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListAuditEvents

> AdminAuditEventsApiResponseDto adminControllerListAuditEvents(page, limit, search, entityType, action)

List sanitized audit events for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListAuditEventsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // string (optional)
    entityType: entityType_example,
    // string (optional)
    action: action_example,
  } satisfies AdminControllerListAuditEventsRequest;

  try {
    const data = await api.adminControllerListAuditEvents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **entityType** | `string` |  | [Optional] [Defaults to `undefined`] |
| **action** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminAuditEventsApiResponseDto**](AdminAuditEventsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListNotifications

> AdminNotificationsApiResponseDto adminControllerListNotifications(page, limit, search, type, status, channel)

List notification outbox rows for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListNotificationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // string (optional)
    type: type_example,
    // 'pending' | 'processing' | 'sent' | 'failed' | 'skipped' (optional)
    status: status_example,
    // 'email' (optional)
    channel: channel_example,
  } satisfies AdminControllerListNotificationsRequest;

  try {
    const data = await api.adminControllerListNotifications(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **type** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `processing`, `sent`, `failed`, `skipped` |  | [Optional] [Defaults to `undefined`] [Enum: pending, processing, sent, failed, skipped] |
| **channel** | `email` |  | [Optional] [Defaults to `undefined`] [Enum: email] |

### Return type

[**AdminNotificationsApiResponseDto**](AdminNotificationsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListOrganizers

> AdminOrganizersApiResponseDto adminControllerListOrganizers(page, limit, search, verificationStatus)

List organizer profiles for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListOrganizersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'pending' | 'verified' | 'rejected' (optional)
    verificationStatus: verificationStatus_example,
  } satisfies AdminControllerListOrganizersRequest;

  try {
    const data = await api.adminControllerListOrganizers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **verificationStatus** | `pending`, `verified`, `rejected` |  | [Optional] [Defaults to `undefined`] [Enum: pending, verified, rejected] |

### Return type

[**AdminOrganizersApiResponseDto**](AdminOrganizersApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListPayments

> AdminPaymentsApiResponseDto adminControllerListPayments(page, limit, search, provider, status, tournamentId, registrationId, from, to)

List payment records for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'manual' | 'mock' | 'razorpay' | 'future_provider' (optional)
    provider: provider_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    registrationId: registrationId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerListPaymentsRequest;

  try {
    const data = await api.adminControllerListPayments(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **provider** | `manual`, `mock`, `razorpay`, `future_provider` |  | [Optional] [Defaults to `undefined`] [Enum: manual, mock, razorpay, future_provider] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminPaymentsApiResponseDto**](AdminPaymentsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListReconciliationRuns

> AdminReconciliationRunsApiResponseDto adminControllerListReconciliationRuns(page, limit, search, provider, status, from, to)

List payment reconciliation runs for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListReconciliationRunsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'manual' | 'mock' | 'razorpay' | 'future_provider' (optional)
    provider: provider_example,
    // 'started' | 'completed' | 'failed' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerListReconciliationRunsRequest;

  try {
    const data = await api.adminControllerListReconciliationRuns(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **provider** | `manual`, `mock`, `razorpay`, `future_provider` |  | [Optional] [Defaults to `undefined`] [Enum: manual, mock, razorpay, future_provider] |
| **status** | `started`, `completed`, `failed` |  | [Optional] [Defaults to `undefined`] [Enum: started, completed, failed] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminReconciliationRunsApiResponseDto**](AdminReconciliationRunsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListRegistrations

> AdminRegistrationsApiResponseDto adminControllerListRegistrations(page, limit, search, status, paymentStatus, tournamentId, from, to)

List registrations for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListRegistrationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    paymentStatus: paymentStatus_example,
    // string (optional)
    tournamentId: tournamentId_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies AdminControllerListRegistrationsRequest;

  try {
    const data = await api.adminControllerListRegistrations(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
| **paymentStatus** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **tournamentId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminRegistrationsApiResponseDto**](AdminRegistrationsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListTournaments

> AdminTournamentsApiResponseDto adminControllerListTournaments(page, limit, search, status, organizerId)

List tournaments for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListTournamentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'draft' | 'published' | 'archived' | 'blocked' (optional)
    status: status_example,
    // string (optional)
    organizerId: organizerId_example,
  } satisfies AdminControllerListTournamentsRequest;

  try {
    const data = await api.adminControllerListTournaments(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `draft`, `published`, `archived`, `blocked` |  | [Optional] [Defaults to `undefined`] [Enum: draft, published, archived, blocked] |
| **organizerId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminTournamentsApiResponseDto**](AdminTournamentsApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListUsers

> AdminUsersApiResponseDto adminControllerListUsers(page, limit, search, role)

List platform users for support inspection

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    search: search text,
    // 'PLAYER' | 'ORGANIZER' | 'ADMIN' (optional)
    role: role_example,
  } satisfies AdminControllerListUsersRequest;

  try {
    const data = await api.adminControllerListUsers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **role** | `PLAYER`, `ORGANIZER`, `ADMIN` |  | [Optional] [Defaults to `undefined`] [Enum: PLAYER, ORGANIZER, ADMIN] |

### Return type

[**AdminUsersApiResponseDto**](AdminUsersApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerRejectOrganizer

> AdminOrganizerApiResponseDto adminControllerRejectOrganizer(organizerId, rejectOrganizerVerificationRequestDto)

Reject an organizer verification request with audit trail

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerRejectOrganizerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    organizerId: organizerId_example,
    // RejectOrganizerVerificationRequestDto
    rejectOrganizerVerificationRequestDto: ...,
  } satisfies AdminControllerRejectOrganizerRequest;

  try {
    const data = await api.adminControllerRejectOrganizer(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **organizerId** | `string` |  | [Defaults to `undefined`] |
| **rejectOrganizerVerificationRequestDto** | [RejectOrganizerVerificationRequestDto](RejectOrganizerVerificationRequestDto.md) |  | |

### Return type

[**AdminOrganizerApiResponseDto**](AdminOrganizerApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerResetOrganizerVerification

> AdminOrganizerApiResponseDto adminControllerResetOrganizerVerification(organizerId)

Reset organizer verification to pending with audit trail

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerResetOrganizerVerificationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    organizerId: organizerId_example,
  } satisfies AdminControllerResetOrganizerVerificationRequest;

  try {
    const data = await api.adminControllerResetOrganizerVerification(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **organizerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminOrganizerApiResponseDto**](AdminOrganizerApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerRetryNotification

> AdminNotificationApiResponseDto adminControllerRetryNotification(notificationId)

Return a failed or skipped notification to pending for processor retry

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerRetryNotificationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    notificationId: notificationId_example,
  } satisfies AdminControllerRetryNotificationRequest;

  try {
    const data = await api.adminControllerRetryNotification(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **notificationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminNotificationApiResponseDto**](AdminNotificationApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerSkipNotification

> AdminNotificationApiResponseDto adminControllerSkipNotification(notificationId, skipNotificationRequestDto)

Mark a pending or failed notification as skipped with audit trail

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerSkipNotificationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    notificationId: notificationId_example,
    // SkipNotificationRequestDto
    skipNotificationRequestDto: ...,
  } satisfies AdminControllerSkipNotificationRequest;

  try {
    const data = await api.adminControllerSkipNotification(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **notificationId** | `string` |  | [Defaults to `undefined`] |
| **skipNotificationRequestDto** | [SkipNotificationRequestDto](SkipNotificationRequestDto.md) |  | |

### Return type

[**AdminNotificationApiResponseDto**](AdminNotificationApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerVerifyOrganizer

> AdminOrganizerApiResponseDto adminControllerVerifyOrganizer(organizerId)

Verify an organizer profile with audit trail

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerVerifyOrganizerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminApi(config);

  const body = {
    // string
    organizerId: organizerId_example,
  } satisfies AdminControllerVerifyOrganizerRequest;

  try {
    const data = await api.adminControllerVerifyOrganizer(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **organizerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminOrganizerApiResponseDto**](AdminOrganizerApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

