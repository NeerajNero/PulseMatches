# OrganizerFixturesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**organizerFixturesControllerArchiveFixtureSet**](OrganizerFixturesApi.md#organizerfixturescontrollerarchivefixtureset) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/archive | Archive one fixture set |
| [**organizerFixturesControllerCompleteMatch**](OrganizerFixturesApi.md#organizerfixturescontrollercompletematch) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/matches/{matchId}/complete | Complete a match with generic scores and a winner |
| [**organizerFixturesControllerExportFixtureResults**](OrganizerFixturesApi.md#organizerfixturescontrollerexportfixtureresults) | **GET** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/results/export.csv | Export fixture match results for one owned tournament fixture set as CSV |
| [**organizerFixturesControllerFindFixtureResults**](OrganizerFixturesApi.md#organizerfixturescontrollerfindfixtureresults) | **GET** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/results | Get fixture rounds, match scores, winners, and standings |
| [**organizerFixturesControllerFindFixtureSet**](OrganizerFixturesApi.md#organizerfixturescontrollerfindfixtureset) | **GET** /organizer/tournaments/{id}/fixtures/{fixtureSetId} | Get fixture set rounds and matches for one owned tournament |
| [**organizerFixturesControllerFindFixtureSets**](OrganizerFixturesApi.md#organizerfixturescontrollerfindfixturesets) | **GET** /organizer/tournaments/{id}/fixtures | List fixture sets for one owned organizer tournament |
| [**organizerFixturesControllerGenerateFixtureSet**](OrganizerFixturesApi.md#organizerfixturescontrollergeneratefixtureset) | **POST** /organizer/tournaments/{id}/categories/{categoryId}/fixtures/generate | Generate a fixture set for one tournament category |
| [**organizerFixturesControllerPublishFixtureResults**](OrganizerFixturesApi.md#organizerfixturescontrollerpublishfixtureresults) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/publish-results | Publish one fixture set for public read-only fixtures and results |
| [**organizerFixturesControllerReopenMatch**](OrganizerFixturesApi.md#organizerfixturescontrollerreopenmatch) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/matches/{matchId}/reopen | Reopen a completed match when it is safe |
| [**organizerFixturesControllerUnpublishFixtureResults**](OrganizerFixturesApi.md#organizerfixturescontrollerunpublishfixtureresults) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/unpublish-results | Hide one fixture set from public fixtures and results |
| [**organizerFixturesControllerUpdateMatchSchedule**](OrganizerFixturesApi.md#organizerfixturescontrollerupdatematchschedule) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/matches/{matchId} | Update match schedule fields only |
| [**organizerFixturesControllerUpdateMatchScore**](OrganizerFixturesApi.md#organizerfixturescontrollerupdatematchscore) | **PATCH** /organizer/tournaments/{id}/fixtures/{fixtureSetId}/matches/{matchId}/score | Save generic score values for one match |



## organizerFixturesControllerArchiveFixtureSet

> FixtureSetApiResponseDto organizerFixturesControllerArchiveFixtureSet(id, fixtureSetId)

Archive one fixture set

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerArchiveFixtureSetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerArchiveFixtureSetRequest;

  try {
    const data = await api.organizerFixturesControllerArchiveFixtureSet(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerCompleteMatch

> FixtureSetApiResponseDto organizerFixturesControllerCompleteMatch(id, fixtureSetId, matchId, updateMatchScoreRequestDto)

Complete a match with generic scores and a winner

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerCompleteMatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
    // string
    matchId: matchId_example,
    // UpdateMatchScoreRequestDto
    updateMatchScoreRequestDto: ...,
  } satisfies OrganizerFixturesControllerCompleteMatchRequest;

  try {
    const data = await api.organizerFixturesControllerCompleteMatch(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |
| **matchId** | `string` |  | [Defaults to `undefined`] |
| **updateMatchScoreRequestDto** | [UpdateMatchScoreRequestDto](UpdateMatchScoreRequestDto.md) |  | |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerExportFixtureResults

> organizerFixturesControllerExportFixtureResults(id, fixtureSetId)

Export fixture match results for one owned tournament fixture set as CSV

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerExportFixtureResultsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerExportFixtureResultsRequest;

  try {
    const data = await api.organizerFixturesControllerExportFixtureResults(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

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


## organizerFixturesControllerFindFixtureResults

> FixtureSetApiResponseDto organizerFixturesControllerFindFixtureResults(id, fixtureSetId)

Get fixture rounds, match scores, winners, and standings

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerFindFixtureResultsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerFindFixtureResultsRequest;

  try {
    const data = await api.organizerFixturesControllerFindFixtureResults(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerFindFixtureSet

> FixtureSetApiResponseDto organizerFixturesControllerFindFixtureSet(id, fixtureSetId)

Get fixture set rounds and matches for one owned tournament

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerFindFixtureSetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerFindFixtureSetRequest;

  try {
    const data = await api.organizerFixturesControllerFindFixtureSet(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerFindFixtureSets

> FixtureSetListApiResponseDto organizerFixturesControllerFindFixtureSets(id)

List fixture sets for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerFindFixtureSetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerFixturesControllerFindFixtureSetsRequest;

  try {
    const data = await api.organizerFixturesControllerFindFixtureSets(body);
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

[**FixtureSetListApiResponseDto**](FixtureSetListApiResponseDto.md)

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


## organizerFixturesControllerGenerateFixtureSet

> FixtureSetApiResponseDto organizerFixturesControllerGenerateFixtureSet(id, categoryId, generateFixtureSetRequestDto)

Generate a fixture set for one tournament category

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerGenerateFixtureSetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    categoryId: categoryId_example,
    // GenerateFixtureSetRequestDto
    generateFixtureSetRequestDto: ...,
  } satisfies OrganizerFixturesControllerGenerateFixtureSetRequest;

  try {
    const data = await api.organizerFixturesControllerGenerateFixtureSet(body);
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
| **categoryId** | `string` |  | [Defaults to `undefined`] |
| **generateFixtureSetRequestDto** | [GenerateFixtureSetRequestDto](GenerateFixtureSetRequestDto.md) |  | |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerPublishFixtureResults

> FixtureSetApiResponseDto organizerFixturesControllerPublishFixtureResults(id, fixtureSetId)

Publish one fixture set for public read-only fixtures and results

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerPublishFixtureResultsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerPublishFixtureResultsRequest;

  try {
    const data = await api.organizerFixturesControllerPublishFixtureResults(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerReopenMatch

> FixtureSetApiResponseDto organizerFixturesControllerReopenMatch(id, fixtureSetId, matchId)

Reopen a completed match when it is safe

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerReopenMatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
    // string
    matchId: matchId_example,
  } satisfies OrganizerFixturesControllerReopenMatchRequest;

  try {
    const data = await api.organizerFixturesControllerReopenMatch(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |
| **matchId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerUnpublishFixtureResults

> FixtureSetApiResponseDto organizerFixturesControllerUnpublishFixtureResults(id, fixtureSetId)

Hide one fixture set from public fixtures and results

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerUnpublishFixtureResultsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
  } satisfies OrganizerFixturesControllerUnpublishFixtureResultsRequest;

  try {
    const data = await api.organizerFixturesControllerUnpublishFixtureResults(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FixtureSetApiResponseDto**](FixtureSetApiResponseDto.md)

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


## organizerFixturesControllerUpdateMatchSchedule

> FixtureMatchApiResponseDto organizerFixturesControllerUpdateMatchSchedule(id, fixtureSetId, matchId, updateMatchScheduleRequestDto)

Update match schedule fields only

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerUpdateMatchScheduleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
    // string
    matchId: matchId_example,
    // UpdateMatchScheduleRequestDto
    updateMatchScheduleRequestDto: ...,
  } satisfies OrganizerFixturesControllerUpdateMatchScheduleRequest;

  try {
    const data = await api.organizerFixturesControllerUpdateMatchSchedule(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |
| **matchId** | `string` |  | [Defaults to `undefined`] |
| **updateMatchScheduleRequestDto** | [UpdateMatchScheduleRequestDto](UpdateMatchScheduleRequestDto.md) |  | |

### Return type

[**FixtureMatchApiResponseDto**](FixtureMatchApiResponseDto.md)

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


## organizerFixturesControllerUpdateMatchScore

> FixtureMatchApiResponseDto organizerFixturesControllerUpdateMatchScore(id, fixtureSetId, matchId, updateMatchScoreRequestDto)

Save generic score values for one match

### Example

```ts
import {
  Configuration,
  OrganizerFixturesApi,
} from '';
import type { OrganizerFixturesControllerUpdateMatchScoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerFixturesApi(config);

  const body = {
    // string
    id: id_example,
    // string
    fixtureSetId: fixtureSetId_example,
    // string
    matchId: matchId_example,
    // UpdateMatchScoreRequestDto
    updateMatchScoreRequestDto: ...,
  } satisfies OrganizerFixturesControllerUpdateMatchScoreRequest;

  try {
    const data = await api.organizerFixturesControllerUpdateMatchScore(body);
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
| **fixtureSetId** | `string` |  | [Defaults to `undefined`] |
| **matchId** | `string` |  | [Defaults to `undefined`] |
| **updateMatchScoreRequestDto** | [UpdateMatchScoreRequestDto](UpdateMatchScoreRequestDto.md) |  | |

### Return type

[**FixtureMatchApiResponseDto**](FixtureMatchApiResponseDto.md)

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

