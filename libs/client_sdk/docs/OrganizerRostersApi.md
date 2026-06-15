# OrganizerRostersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**organizerRostersControllerApproveRegistration**](OrganizerRostersApi.md#organizerrosterscontrollerapproveregistration) | **PATCH** /organizer/tournaments/{id}/registrations/{registrationId}/approve | Approve one pending registration and create an eligible participant |
| [**organizerRostersControllerCancelRegistration**](OrganizerRostersApi.md#organizerrosterscontrollercancelregistration) | **PATCH** /organizer/tournaments/{id}/registrations/{registrationId}/cancel | Cancel one pending or confirmed registration as organizer |
| [**organizerRostersControllerCreateParticipant**](OrganizerRostersApi.md#organizerrosterscontrollercreateparticipant) | **POST** /organizer/tournaments/{id}/participants | Manually add a roster participant |
| [**organizerRostersControllerCreatePaymentRefund**](OrganizerRostersApi.md#organizerrosterscontrollercreatepaymentrefund) | **POST** /organizer/tournaments/{id}/registrations/{registrationId}/refunds | Record or request a refund for one owned tournament registration |
| [**organizerRostersControllerCreateTeam**](OrganizerRostersApi.md#organizerrosterscontrollercreateteam) | **POST** /organizer/tournaments/{id}/teams | Create a team for one owned organizer tournament |
| [**organizerRostersControllerCreateTeamMember**](OrganizerRostersApi.md#organizerrosterscontrollercreateteammember) | **POST** /organizer/tournaments/{id}/teams/{teamId}/members | Add a member to one team |
| [**organizerRostersControllerDeleteParticipant**](OrganizerRostersApi.md#organizerrosterscontrollerdeleteparticipant) | **DELETE** /organizer/tournaments/{id}/participants/{participantId} | Withdraw one roster participant |
| [**organizerRostersControllerDeleteTeam**](OrganizerRostersApi.md#organizerrosterscontrollerdeleteteam) | **DELETE** /organizer/tournaments/{id}/teams/{teamId} | Withdraw one team |
| [**organizerRostersControllerDeleteTeamMember**](OrganizerRostersApi.md#organizerrosterscontrollerdeleteteammember) | **DELETE** /organizer/tournaments/{id}/teams/{teamId}/members/{memberId} | Remove one member from a team |
| [**organizerRostersControllerExportParticipants**](OrganizerRostersApi.md#organizerrosterscontrollerexportparticipants) | **GET** /organizer/tournaments/{id}/participants/export.csv | Export participants for one owned organizer tournament as CSV |
| [**organizerRostersControllerExportPaymentReport**](OrganizerRostersApi.md#organizerrosterscontrollerexportpaymentreport) | **GET** /organizer/tournaments/{id}/reports/payments/export.csv | Export organizer payment report as CSV |
| [**organizerRostersControllerExportPayments**](OrganizerRostersApi.md#organizerrosterscontrollerexportpayments) | **GET** /organizer/tournaments/{id}/payments/export.csv | Export payment summaries for one owned organizer tournament as CSV |
| [**organizerRostersControllerExportRegistrationReport**](OrganizerRostersApi.md#organizerrosterscontrollerexportregistrationreport) | **GET** /organizer/tournaments/{id}/reports/registrations/export.csv | Export organizer registration report as CSV |
| [**organizerRostersControllerExportRegistrations**](OrganizerRostersApi.md#organizerrosterscontrollerexportregistrations) | **GET** /organizer/tournaments/{id}/registrations/export.csv | Export registrations for one owned organizer tournament as CSV |
| [**organizerRostersControllerExportTeams**](OrganizerRostersApi.md#organizerrosterscontrollerexportteams) | **GET** /organizer/tournaments/{id}/teams/export.csv | Export teams and members for one owned organizer tournament as CSV |
| [**organizerRostersControllerFindParticipants**](OrganizerRostersApi.md#organizerrosterscontrollerfindparticipants) | **GET** /organizer/tournaments/{id}/participants | List roster participants for one owned organizer tournament |
| [**organizerRostersControllerFindPaymentDetail**](OrganizerRostersApi.md#organizerrosterscontrollerfindpaymentdetail) | **GET** /organizer/tournaments/{id}/payments/{registrationId} | Get organizer-safe payment diagnostics for one owned registration |
| [**organizerRostersControllerFindPayments**](OrganizerRostersApi.md#organizerrosterscontrollerfindpayments) | **GET** /organizer/tournaments/{id}/payments | List manual registration payments for one owned organizer tournament |
| [**organizerRostersControllerFindRegistrations**](OrganizerRostersApi.md#organizerrosterscontrollerfindregistrations) | **GET** /organizer/tournaments/{id}/registrations | List registrations for one owned organizer tournament |
| [**organizerRostersControllerFindTeam**](OrganizerRostersApi.md#organizerrosterscontrollerfindteam) | **GET** /organizer/tournaments/{id}/teams/{teamId} | Get one team with members |
| [**organizerRostersControllerFindTeams**](OrganizerRostersApi.md#organizerrosterscontrollerfindteams) | **GET** /organizer/tournaments/{id}/teams | List teams for one owned organizer tournament |
| [**organizerRostersControllerGetReportSummary**](OrganizerRostersApi.md#organizerrosterscontrollergetreportsummary) | **GET** /organizer/tournaments/{id}/reports/summary | Get organizer-owned tournament reporting summary |
| [**organizerRostersControllerGetSummary**](OrganizerRostersApi.md#organizerrosterscontrollergetsummary) | **GET** /organizer/tournaments/{id}/roster-summary | Get roster summary for one owned organizer tournament |
| [**organizerRostersControllerRejectRegistration**](OrganizerRostersApi.md#organizerrosterscontrollerrejectregistration) | **PATCH** /organizer/tournaments/{id}/registrations/{registrationId}/reject | Reject one pending registration |
| [**organizerRostersControllerUpdateParticipant**](OrganizerRostersApi.md#organizerrosterscontrollerupdateparticipant) | **PATCH** /organizer/tournaments/{id}/participants/{participantId} | Update one roster participant |
| [**organizerRostersControllerUpdateRegistrationPayment**](OrganizerRostersApi.md#organizerrosterscontrollerupdateregistrationpayment) | **PATCH** /organizer/tournaments/{id}/registrations/{registrationId}/payment | Update manual payment status for one owned tournament registration |
| [**organizerRostersControllerUpdateTeam**](OrganizerRostersApi.md#organizerrosterscontrollerupdateteam) | **PATCH** /organizer/tournaments/{id}/teams/{teamId} | Update one team |
| [**organizerRostersControllerUpdateTeamMember**](OrganizerRostersApi.md#organizerrosterscontrollerupdateteammember) | **PATCH** /organizer/tournaments/{id}/teams/{teamId}/members/{memberId} | Update one team member |



## organizerRostersControllerApproveRegistration

> OrganizerRegistrationApiResponseDto organizerRostersControllerApproveRegistration(id, registrationId)

Approve one pending registration and create an eligible participant

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerApproveRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
  } satisfies OrganizerRostersControllerApproveRegistrationRequest;

  try {
    const data = await api.organizerRostersControllerApproveRegistration(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerRegistrationApiResponseDto**](OrganizerRegistrationApiResponseDto.md)

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


## organizerRostersControllerCancelRegistration

> OrganizerRegistrationApiResponseDto organizerRostersControllerCancelRegistration(id, registrationId)

Cancel one pending or confirmed registration as organizer

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerCancelRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
  } satisfies OrganizerRostersControllerCancelRegistrationRequest;

  try {
    const data = await api.organizerRostersControllerCancelRegistration(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerRegistrationApiResponseDto**](OrganizerRegistrationApiResponseDto.md)

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


## organizerRostersControllerCreateParticipant

> OrganizerParticipantApiResponseDto organizerRostersControllerCreateParticipant(id, createParticipantRequestDto)

Manually add a roster participant

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerCreateParticipantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // CreateParticipantRequestDto
    createParticipantRequestDto: ...,
  } satisfies OrganizerRostersControllerCreateParticipantRequest;

  try {
    const data = await api.organizerRostersControllerCreateParticipant(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **createParticipantRequestDto** | [CreateParticipantRequestDto](CreateParticipantRequestDto.md) |  | |

### Return type

[**OrganizerParticipantApiResponseDto**](OrganizerParticipantApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## organizerRostersControllerCreatePaymentRefund

> OrganizerPaymentDetailApiResponseDto organizerRostersControllerCreatePaymentRefund(id, registrationId, createPaymentRefundRequestDto)

Record or request a refund for one owned tournament registration

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerCreatePaymentRefundRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
    // CreatePaymentRefundRequestDto
    createPaymentRefundRequestDto: ...,
  } satisfies OrganizerRostersControllerCreatePaymentRefundRequest;

  try {
    const data = await api.organizerRostersControllerCreatePaymentRefund(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |
| **createPaymentRefundRequestDto** | [CreatePaymentRefundRequestDto](CreatePaymentRefundRequestDto.md) |  | |

### Return type

[**OrganizerPaymentDetailApiResponseDto**](OrganizerPaymentDetailApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## organizerRostersControllerCreateTeam

> OrganizerTeamApiResponseDto organizerRostersControllerCreateTeam(id, createTeamRequestDto)

Create a team for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerCreateTeamRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // CreateTeamRequestDto
    createTeamRequestDto: ...,
  } satisfies OrganizerRostersControllerCreateTeamRequest;

  try {
    const data = await api.organizerRostersControllerCreateTeam(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **createTeamRequestDto** | [CreateTeamRequestDto](CreateTeamRequestDto.md) |  | |

### Return type

[**OrganizerTeamApiResponseDto**](OrganizerTeamApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## organizerRostersControllerCreateTeamMember

> OrganizerTeamMemberApiResponseDto organizerRostersControllerCreateTeamMember(id, teamId, createTeamMemberRequestDto)

Add a member to one team

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerCreateTeamMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
    // CreateTeamMemberRequestDto
    createTeamMemberRequestDto: ...,
  } satisfies OrganizerRostersControllerCreateTeamMemberRequest;

  try {
    const data = await api.organizerRostersControllerCreateTeamMember(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |
| **createTeamMemberRequestDto** | [CreateTeamMemberRequestDto](CreateTeamMemberRequestDto.md) |  | |

### Return type

[**OrganizerTeamMemberApiResponseDto**](OrganizerTeamMemberApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## organizerRostersControllerDeleteParticipant

> OrganizerParticipantApiResponseDto organizerRostersControllerDeleteParticipant(id, participantId)

Withdraw one roster participant

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerDeleteParticipantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    participantId: participantId_example,
  } satisfies OrganizerRostersControllerDeleteParticipantRequest;

  try {
    const data = await api.organizerRostersControllerDeleteParticipant(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **participantId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerParticipantApiResponseDto**](OrganizerParticipantApiResponseDto.md)

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


## organizerRostersControllerDeleteTeam

> OrganizerTeamApiResponseDto organizerRostersControllerDeleteTeam(id, teamId)

Withdraw one team

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerDeleteTeamRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
  } satisfies OrganizerRostersControllerDeleteTeamRequest;

  try {
    const data = await api.organizerRostersControllerDeleteTeam(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerTeamApiResponseDto**](OrganizerTeamApiResponseDto.md)

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


## organizerRostersControllerDeleteTeamMember

> OrganizerTeamMemberApiResponseDto organizerRostersControllerDeleteTeamMember(id, teamId, memberId)

Remove one member from a team

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerDeleteTeamMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
    // string
    memberId: memberId_example,
  } satisfies OrganizerRostersControllerDeleteTeamMemberRequest;

  try {
    const data = await api.organizerRostersControllerDeleteTeamMember(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |
| **memberId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerTeamMemberApiResponseDto**](OrganizerTeamMemberApiResponseDto.md)

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


## organizerRostersControllerExportParticipants

> organizerRostersControllerExportParticipants(id, categoryId, search, status)

Export participants for one owned organizer tournament as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportParticipantsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'active' | 'withdrawn' | 'disqualified' (optional)
    status: status_example,
  } satisfies OrganizerRostersControllerExportParticipantsRequest;

  try {
    const data = await api.organizerRostersControllerExportParticipants(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `active`, `withdrawn`, `disqualified` |  | [Optional] [Defaults to `undefined`] [Enum: active, withdrawn, disqualified] |

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


## organizerRostersControllerExportPaymentReport

> organizerRostersControllerExportPaymentReport(id, categoryId, search, status, from, to)

Export organizer payment report as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportPaymentReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerExportPaymentReportRequest;

  try {
    const data = await api.organizerRostersControllerExportPaymentReport(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
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


## organizerRostersControllerExportPayments

> organizerRostersControllerExportPayments(id, categoryId, search, status, from, to)

Export payment summaries for one owned organizer tournament as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerExportPaymentsRequest;

  try {
    const data = await api.organizerRostersControllerExportPayments(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
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


## organizerRostersControllerExportRegistrationReport

> organizerRostersControllerExportRegistrationReport(id, categoryId, search, status, from, to)

Export organizer registration report as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportRegistrationReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerExportRegistrationReportRequest;

  try {
    const data = await api.organizerRostersControllerExportRegistrationReport(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
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


## organizerRostersControllerExportRegistrations

> organizerRostersControllerExportRegistrations(id, categoryId, search, status, from, to)

Export registrations for one owned organizer tournament as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportRegistrationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerExportRegistrationsRequest;

  try {
    const data = await api.organizerRostersControllerExportRegistrations(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
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


## organizerRostersControllerExportTeams

> organizerRostersControllerExportTeams(id, categoryId, search, status)

Export teams and members for one owned organizer tournament as CSV

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerExportTeamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'active' | 'withdrawn' | 'disqualified' (optional)
    status: status_example,
  } satisfies OrganizerRostersControllerExportTeamsRequest;

  try {
    const data = await api.organizerRostersControllerExportTeams(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `active`, `withdrawn`, `disqualified` |  | [Optional] [Defaults to `undefined`] [Enum: active, withdrawn, disqualified] |

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


## organizerRostersControllerFindParticipants

> OrganizerParticipantListApiResponseDto organizerRostersControllerFindParticipants(id, categoryId, search, status)

List roster participants for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindParticipantsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'active' | 'withdrawn' | 'disqualified' (optional)
    status: status_example,
  } satisfies OrganizerRostersControllerFindParticipantsRequest;

  try {
    const data = await api.organizerRostersControllerFindParticipants(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `active`, `withdrawn`, `disqualified` |  | [Optional] [Defaults to `undefined`] [Enum: active, withdrawn, disqualified] |

### Return type

[**OrganizerParticipantListApiResponseDto**](OrganizerParticipantListApiResponseDto.md)

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


## organizerRostersControllerFindPaymentDetail

> OrganizerPaymentDetailApiResponseDto organizerRostersControllerFindPaymentDetail(id, registrationId)

Get organizer-safe payment diagnostics for one owned registration

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindPaymentDetailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
  } satisfies OrganizerRostersControllerFindPaymentDetailRequest;

  try {
    const data = await api.organizerRostersControllerFindPaymentDetail(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerPaymentDetailApiResponseDto**](OrganizerPaymentDetailApiResponseDto.md)

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


## organizerRostersControllerFindPayments

> OrganizerPaymentListApiResponseDto organizerRostersControllerFindPayments(id, categoryId, search, status, from, to)

List manual registration payments for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'not_required' | 'pending_offline' | 'paid' | 'failed' | 'refunded' | 'waived' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerFindPaymentsRequest;

  try {
    const data = await api.organizerRostersControllerFindPayments(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `not_required`, `pending_offline`, `paid`, `failed`, `refunded`, `waived` |  | [Optional] [Defaults to `undefined`] [Enum: not_required, pending_offline, paid, failed, refunded, waived] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**OrganizerPaymentListApiResponseDto**](OrganizerPaymentListApiResponseDto.md)

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


## organizerRostersControllerFindRegistrations

> OrganizerRegistrationListApiResponseDto organizerRostersControllerFindRegistrations(id, categoryId, search, status, from, to)

List registrations for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindRegistrationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'pending' | 'confirmed' | 'rejected' | 'cancelled' (optional)
    status: status_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerFindRegistrationsRequest;

  try {
    const data = await api.organizerRostersControllerFindRegistrations(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `rejected`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, rejected, cancelled] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**OrganizerRegistrationListApiResponseDto**](OrganizerRegistrationListApiResponseDto.md)

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


## organizerRostersControllerFindTeam

> OrganizerTeamApiResponseDto organizerRostersControllerFindTeam(id, teamId)

Get one team with members

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindTeamRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
  } satisfies OrganizerRostersControllerFindTeamRequest;

  try {
    const data = await api.organizerRostersControllerFindTeam(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerTeamApiResponseDto**](OrganizerTeamApiResponseDto.md)

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


## organizerRostersControllerFindTeams

> OrganizerTeamListApiResponseDto organizerRostersControllerFindTeams(id, categoryId, search, status)

List teams for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerFindTeamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    categoryId: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: aarav,
    // 'active' | 'withdrawn' | 'disqualified' (optional)
    status: status_example,
  } satisfies OrganizerRostersControllerFindTeamsRequest;

  try {
    const data = await api.organizerRostersControllerFindTeams(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **categoryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `active`, `withdrawn`, `disqualified` |  | [Optional] [Defaults to `undefined`] [Enum: active, withdrawn, disqualified] |

### Return type

[**OrganizerTeamListApiResponseDto**](OrganizerTeamListApiResponseDto.md)

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


## organizerRostersControllerGetReportSummary

> OrganizerTournamentReportSummaryApiResponseDto organizerRostersControllerGetReportSummary(id, from, to)

Get organizer-owned tournament reporting summary

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerGetReportSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string (optional)
    from: 2026-06-01,
    // string (optional)
    to: 2026-06-30,
  } satisfies OrganizerRostersControllerGetReportSummaryRequest;

  try {
    const data = await api.organizerRostersControllerGetReportSummary(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **from** | `string` |  | [Optional] [Defaults to `undefined`] |
| **to** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**OrganizerTournamentReportSummaryApiResponseDto**](OrganizerTournamentReportSummaryApiResponseDto.md)

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


## organizerRostersControllerGetSummary

> OrganizerRosterSummaryApiResponseDto organizerRostersControllerGetSummary(id)

Get roster summary for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerGetSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerRostersControllerGetSummaryRequest;

  try {
    const data = await api.organizerRostersControllerGetSummary(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**OrganizerRosterSummaryApiResponseDto**](OrganizerRosterSummaryApiResponseDto.md)

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


## organizerRostersControllerRejectRegistration

> OrganizerRegistrationApiResponseDto organizerRostersControllerRejectRegistration(id, registrationId, rejectRegistrationRequestDto)

Reject one pending registration

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerRejectRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
    // RejectRegistrationRequestDto
    rejectRegistrationRequestDto: ...,
  } satisfies OrganizerRostersControllerRejectRegistrationRequest;

  try {
    const data = await api.organizerRostersControllerRejectRegistration(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |
| **rejectRegistrationRequestDto** | [RejectRegistrationRequestDto](RejectRegistrationRequestDto.md) |  | |

### Return type

[**OrganizerRegistrationApiResponseDto**](OrganizerRegistrationApiResponseDto.md)

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


## organizerRostersControllerUpdateParticipant

> OrganizerParticipantApiResponseDto organizerRostersControllerUpdateParticipant(id, participantId, updateParticipantRequestDto)

Update one roster participant

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerUpdateParticipantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    participantId: participantId_example,
    // UpdateParticipantRequestDto
    updateParticipantRequestDto: ...,
  } satisfies OrganizerRostersControllerUpdateParticipantRequest;

  try {
    const data = await api.organizerRostersControllerUpdateParticipant(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **participantId** | `string` |  | [Defaults to `undefined`] |
| **updateParticipantRequestDto** | [UpdateParticipantRequestDto](UpdateParticipantRequestDto.md) |  | |

### Return type

[**OrganizerParticipantApiResponseDto**](OrganizerParticipantApiResponseDto.md)

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


## organizerRostersControllerUpdateRegistrationPayment

> OrganizerPaymentApiResponseDto organizerRostersControllerUpdateRegistrationPayment(id, registrationId, updateRegistrationPaymentRequestDto)

Update manual payment status for one owned tournament registration

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerUpdateRegistrationPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    registrationId: registrationId_example,
    // UpdateRegistrationPaymentRequestDto
    updateRegistrationPaymentRequestDto: ...,
  } satisfies OrganizerRostersControllerUpdateRegistrationPaymentRequest;

  try {
    const data = await api.organizerRostersControllerUpdateRegistrationPayment(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **registrationId** | `string` |  | [Defaults to `undefined`] |
| **updateRegistrationPaymentRequestDto** | [UpdateRegistrationPaymentRequestDto](UpdateRegistrationPaymentRequestDto.md) |  | |

### Return type

[**OrganizerPaymentApiResponseDto**](OrganizerPaymentApiResponseDto.md)

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


## organizerRostersControllerUpdateTeam

> OrganizerTeamApiResponseDto organizerRostersControllerUpdateTeam(id, teamId, updateTeamRequestDto)

Update one team

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerUpdateTeamRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
    // UpdateTeamRequestDto
    updateTeamRequestDto: ...,
  } satisfies OrganizerRostersControllerUpdateTeamRequest;

  try {
    const data = await api.organizerRostersControllerUpdateTeam(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |
| **updateTeamRequestDto** | [UpdateTeamRequestDto](UpdateTeamRequestDto.md) |  | |

### Return type

[**OrganizerTeamApiResponseDto**](OrganizerTeamApiResponseDto.md)

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


## organizerRostersControllerUpdateTeamMember

> OrganizerTeamMemberApiResponseDto organizerRostersControllerUpdateTeamMember(id, teamId, memberId, updateTeamMemberRequestDto)

Update one team member

### Example

```ts
import {
  Configuration,
  OrganizerRostersApi,
} from '';
import type { OrganizerRostersControllerUpdateTeamMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerRostersApi(config);

  const body = {
    // string
    id: id_example,
    // string
    teamId: teamId_example,
    // string
    memberId: memberId_example,
    // UpdateTeamMemberRequestDto
    updateTeamMemberRequestDto: ...,
  } satisfies OrganizerRostersControllerUpdateTeamMemberRequest;

  try {
    const data = await api.organizerRostersControllerUpdateTeamMember(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **teamId** | `string` |  | [Defaults to `undefined`] |
| **memberId** | `string` |  | [Defaults to `undefined`] |
| **updateTeamMemberRequestDto** | [UpdateTeamMemberRequestDto](UpdateTeamMemberRequestDto.md) |  | |

### Return type

[**OrganizerTeamMemberApiResponseDto**](OrganizerTeamMemberApiResponseDto.md)

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

