# DiscoveryApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**discoveryControllerFindCities**](DiscoveryApi.md#discoverycontrollerfindcities) | **GET** /cities | List active public cities |
| [**discoveryControllerFindSports**](DiscoveryApi.md#discoverycontrollerfindsports) | **GET** /sports | List active public sports |
| [**discoveryControllerFindTournamentDetail**](DiscoveryApi.md#discoverycontrollerfindtournamentdetail) | **GET** /tournaments/{slugOrId} | Get a public tournament by slug or UUID |
| [**discoveryControllerFindTournamentFixtures**](DiscoveryApi.md#discoverycontrollerfindtournamentfixtures) | **GET** /tournaments/{slugOrId}/fixtures | List public fixture sets and results for a published tournament |
| [**discoveryControllerFindTournaments**](DiscoveryApi.md#discoverycontrollerfindtournaments) | **GET** /tournaments | List public published tournaments |



## discoveryControllerFindCities

> CitiesApiResponseDto discoveryControllerFindCities()

List active public cities

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { DiscoveryControllerFindCitiesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  try {
    const data = await api.discoveryControllerFindCities();
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

[**CitiesApiResponseDto**](CitiesApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## discoveryControllerFindSports

> SportsApiResponseDto discoveryControllerFindSports()

List active public sports

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { DiscoveryControllerFindSportsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  try {
    const data = await api.discoveryControllerFindSports();
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

[**SportsApiResponseDto**](SportsApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## discoveryControllerFindTournamentDetail

> TournamentDetailApiResponseDto discoveryControllerFindTournamentDetail(slugOrId)

Get a public tournament by slug or UUID

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { DiscoveryControllerFindTournamentDetailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  const body = {
    // string
    slugOrId: slugOrId_example,
  } satisfies DiscoveryControllerFindTournamentDetailRequest;

  try {
    const data = await api.discoveryControllerFindTournamentDetail(body);
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
| **slugOrId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**TournamentDetailApiResponseDto**](TournamentDetailApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## discoveryControllerFindTournamentFixtures

> PublicFixtureSetListApiResponseDto discoveryControllerFindTournamentFixtures(slugOrId)

List public fixture sets and results for a published tournament

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { DiscoveryControllerFindTournamentFixturesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  const body = {
    // string
    slugOrId: slugOrId_example,
  } satisfies DiscoveryControllerFindTournamentFixturesRequest;

  try {
    const data = await api.discoveryControllerFindTournamentFixtures(body);
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
| **slugOrId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PublicFixtureSetListApiResponseDto**](PublicFixtureSetListApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## discoveryControllerFindTournaments

> TournamentListApiResponseDto discoveryControllerFindTournaments(city, sport, status, upcomingOnly, startsFrom, startsTo, search, page, limit)

List public published tournaments

### Example

```ts
import {
  Configuration,
  DiscoveryApi,
} from '';
import type { DiscoveryControllerFindTournamentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DiscoveryApi();

  const body = {
    // string | City slug or UUID. (optional)
    city: bengaluru,
    // string | Sport slug or UUID. (optional)
    sport: badminton,
    // 'draft' | 'published' | 'archived' | 'blocked' (optional)
    status: published,
    // boolean (optional)
    upcomingOnly: true,
    // string (optional)
    startsFrom: 2026-06-01T00:00:00.000Z,
    // string (optional)
    startsTo: 2026-07-01T00:00:00.000Z,
    // string (optional)
    search: open,
    // number (optional)
    page: 1,
    // number (optional)
    limit: 12,
  } satisfies DiscoveryControllerFindTournamentsRequest;

  try {
    const data = await api.discoveryControllerFindTournaments(body);
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
| **city** | `string` | City slug or UUID. | [Optional] [Defaults to `undefined`] |
| **sport** | `string` | Sport slug or UUID. | [Optional] [Defaults to `undefined`] |
| **status** | `draft`, `published`, `archived`, `blocked` |  | [Optional] [Defaults to `undefined`] [Enum: draft, published, archived, blocked] |
| **upcomingOnly** | `boolean` |  | [Optional] [Defaults to `undefined`] |
| **startsFrom** | `string` |  | [Optional] [Defaults to `undefined`] |
| **startsTo** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `12`] |

### Return type

[**TournamentListApiResponseDto**](TournamentListApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

