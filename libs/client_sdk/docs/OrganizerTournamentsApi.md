# OrganizerTournamentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**organizerTournamentsControllerCreateCategory**](OrganizerTournamentsApi.md#organizertournamentscontrollercreatecategory) | **POST** /organizer/tournaments/{id}/categories | Create a category for one owned organizer tournament |
| [**organizerTournamentsControllerCreateTournament**](OrganizerTournamentsApi.md#organizertournamentscontrollercreatetournament) | **POST** /organizer/tournaments | Create a draft tournament for the current organizer |
| [**organizerTournamentsControllerDeleteCategory**](OrganizerTournamentsApi.md#organizertournamentscontrollerdeletecategory) | **DELETE** /organizer/tournaments/{id}/categories/{categoryId} | Deactivate one category for an owned organizer tournament |
| [**organizerTournamentsControllerFindCategories**](OrganizerTournamentsApi.md#organizertournamentscontrollerfindcategories) | **GET** /organizer/tournaments/{id}/categories | List categories for one owned organizer tournament |
| [**organizerTournamentsControllerFindTournament**](OrganizerTournamentsApi.md#organizertournamentscontrollerfindtournament) | **GET** /organizer/tournaments/{id} | Get one owned organizer tournament |
| [**organizerTournamentsControllerFindTournaments**](OrganizerTournamentsApi.md#organizertournamentscontrollerfindtournaments) | **GET** /organizer/tournaments | List current organizer tournaments |
| [**organizerTournamentsControllerGetDashboard**](OrganizerTournamentsApi.md#organizertournamentscontrollergetdashboard) | **GET** /organizer/dashboard | Get current organizer dashboard summary |
| [**organizerTournamentsControllerPublishTournament**](OrganizerTournamentsApi.md#organizertournamentscontrollerpublishtournament) | **PATCH** /organizer/tournaments/{id}/publish | Publish one owned organizer tournament |
| [**organizerTournamentsControllerUnpublishTournament**](OrganizerTournamentsApi.md#organizertournamentscontrollerunpublishtournament) | **PATCH** /organizer/tournaments/{id}/unpublish | Move one owned organizer tournament back to draft |
| [**organizerTournamentsControllerUpdateCategory**](OrganizerTournamentsApi.md#organizertournamentscontrollerupdatecategory) | **PATCH** /organizer/tournaments/{id}/categories/{categoryId} | Update one category for an owned organizer tournament |
| [**organizerTournamentsControllerUpdateTournament**](OrganizerTournamentsApi.md#organizertournamentscontrollerupdatetournament) | **PATCH** /organizer/tournaments/{id} | Update one owned organizer tournament |



## organizerTournamentsControllerCreateCategory

> OrganizerTournamentCategoryApiResponseDto organizerTournamentsControllerCreateCategory(id, createTournamentCategoryRequestDto)

Create a category for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerCreateCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
    // CreateTournamentCategoryRequestDto
    createTournamentCategoryRequestDto: ...,
  } satisfies OrganizerTournamentsControllerCreateCategoryRequest;

  try {
    const data = await api.organizerTournamentsControllerCreateCategory(body);
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
| **createTournamentCategoryRequestDto** | [CreateTournamentCategoryRequestDto](CreateTournamentCategoryRequestDto.md) |  | |

### Return type

[**OrganizerTournamentCategoryApiResponseDto**](OrganizerTournamentCategoryApiResponseDto.md)

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


## organizerTournamentsControllerCreateTournament

> OrganizerTournamentApiResponseDto organizerTournamentsControllerCreateTournament(createOrganizerTournamentRequestDto)

Create a draft tournament for the current organizer

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerCreateTournamentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // CreateOrganizerTournamentRequestDto
    createOrganizerTournamentRequestDto: ...,
  } satisfies OrganizerTournamentsControllerCreateTournamentRequest;

  try {
    const data = await api.organizerTournamentsControllerCreateTournament(body);
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
| **createOrganizerTournamentRequestDto** | [CreateOrganizerTournamentRequestDto](CreateOrganizerTournamentRequestDto.md) |  | |

### Return type

[**OrganizerTournamentApiResponseDto**](OrganizerTournamentApiResponseDto.md)

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


## organizerTournamentsControllerDeleteCategory

> OrganizerTournamentCategoryApiResponseDto organizerTournamentsControllerDeleteCategory(id, categoryId)

Deactivate one category for an owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerDeleteCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
    // string
    categoryId: categoryId_example,
  } satisfies OrganizerTournamentsControllerDeleteCategoryRequest;

  try {
    const data = await api.organizerTournamentsControllerDeleteCategory(body);
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

### Return type

[**OrganizerTournamentCategoryApiResponseDto**](OrganizerTournamentCategoryApiResponseDto.md)

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


## organizerTournamentsControllerFindCategories

> OrganizerTournamentCategoryListApiResponseDto organizerTournamentsControllerFindCategories(id)

List categories for one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerFindCategoriesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerTournamentsControllerFindCategoriesRequest;

  try {
    const data = await api.organizerTournamentsControllerFindCategories(body);
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

[**OrganizerTournamentCategoryListApiResponseDto**](OrganizerTournamentCategoryListApiResponseDto.md)

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


## organizerTournamentsControllerFindTournament

> OrganizerTournamentApiResponseDto organizerTournamentsControllerFindTournament(id)

Get one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerFindTournamentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerTournamentsControllerFindTournamentRequest;

  try {
    const data = await api.organizerTournamentsControllerFindTournament(body);
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

[**OrganizerTournamentApiResponseDto**](OrganizerTournamentApiResponseDto.md)

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


## organizerTournamentsControllerFindTournaments

> OrganizerTournamentListApiResponseDto organizerTournamentsControllerFindTournaments(status, sport, search, page, limit)

List current organizer tournaments

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerFindTournamentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // 'draft' | 'published' | 'archived' | 'blocked' (optional)
    status: status_example,
    // string (optional)
    sport: 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
    // string (optional)
    search: summer cup,
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
  } satisfies OrganizerTournamentsControllerFindTournamentsRequest;

  try {
    const data = await api.organizerTournamentsControllerFindTournaments(body);
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
| **status** | `draft`, `published`, `archived`, `blocked` |  | [Optional] [Defaults to `undefined`] [Enum: draft, published, archived, blocked] |
| **sport** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `12`] |

### Return type

[**OrganizerTournamentListApiResponseDto**](OrganizerTournamentListApiResponseDto.md)

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


## organizerTournamentsControllerGetDashboard

> OrganizerDashboardApiResponseDto organizerTournamentsControllerGetDashboard()

Get current organizer dashboard summary

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerGetDashboardRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  try {
    const data = await api.organizerTournamentsControllerGetDashboard();
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

[**OrganizerDashboardApiResponseDto**](OrganizerDashboardApiResponseDto.md)

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


## organizerTournamentsControllerPublishTournament

> OrganizerTournamentApiResponseDto organizerTournamentsControllerPublishTournament(id)

Publish one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerPublishTournamentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerTournamentsControllerPublishTournamentRequest;

  try {
    const data = await api.organizerTournamentsControllerPublishTournament(body);
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

[**OrganizerTournamentApiResponseDto**](OrganizerTournamentApiResponseDto.md)

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


## organizerTournamentsControllerUnpublishTournament

> OrganizerTournamentApiResponseDto organizerTournamentsControllerUnpublishTournament(id)

Move one owned organizer tournament back to draft

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerUnpublishTournamentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies OrganizerTournamentsControllerUnpublishTournamentRequest;

  try {
    const data = await api.organizerTournamentsControllerUnpublishTournament(body);
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

[**OrganizerTournamentApiResponseDto**](OrganizerTournamentApiResponseDto.md)

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


## organizerTournamentsControllerUpdateCategory

> OrganizerTournamentCategoryApiResponseDto organizerTournamentsControllerUpdateCategory(id, categoryId, updateTournamentCategoryRequestDto)

Update one category for an owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerUpdateCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
    // string
    categoryId: categoryId_example,
    // UpdateTournamentCategoryRequestDto
    updateTournamentCategoryRequestDto: ...,
  } satisfies OrganizerTournamentsControllerUpdateCategoryRequest;

  try {
    const data = await api.organizerTournamentsControllerUpdateCategory(body);
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
| **updateTournamentCategoryRequestDto** | [UpdateTournamentCategoryRequestDto](UpdateTournamentCategoryRequestDto.md) |  | |

### Return type

[**OrganizerTournamentCategoryApiResponseDto**](OrganizerTournamentCategoryApiResponseDto.md)

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


## organizerTournamentsControllerUpdateTournament

> OrganizerTournamentApiResponseDto organizerTournamentsControllerUpdateTournament(id, updateOrganizerTournamentRequestDto)

Update one owned organizer tournament

### Example

```ts
import {
  Configuration,
  OrganizerTournamentsApi,
} from '';
import type { OrganizerTournamentsControllerUpdateTournamentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerTournamentsApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateOrganizerTournamentRequestDto
    updateOrganizerTournamentRequestDto: ...,
  } satisfies OrganizerTournamentsControllerUpdateTournamentRequest;

  try {
    const data = await api.organizerTournamentsControllerUpdateTournament(body);
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
| **updateOrganizerTournamentRequestDto** | [UpdateOrganizerTournamentRequestDto](UpdateOrganizerTournamentRequestDto.md) |  | |

### Return type

[**OrganizerTournamentApiResponseDto**](OrganizerTournamentApiResponseDto.md)

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

