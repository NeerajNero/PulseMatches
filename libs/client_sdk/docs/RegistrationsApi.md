# RegistrationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**registrationsControllerCancelRegistration**](RegistrationsApi.md#registrationscontrollercancelregistration) | **PATCH** /registrations/{id}/cancel | Cancel a pending current-player registration |
| [**registrationsControllerCreateTournamentRegistration**](RegistrationsApi.md#registrationscontrollercreatetournamentregistration) | **POST** /tournaments/{slugOrId}/registrations | Register the current player for a public tournament |
| [**registrationsControllerFindMyRegistrations**](RegistrationsApi.md#registrationscontrollerfindmyregistrations) | **GET** /me/registrations | List registrations for the current player |
| [**registrationsControllerFindRegistration**](RegistrationsApi.md#registrationscontrollerfindregistration) | **GET** /registrations/{id} | Get one current-player registration |



## registrationsControllerCancelRegistration

> RegistrationApiResponseDto registrationsControllerCancelRegistration(id)

Cancel a pending current-player registration

### Example

```ts
import {
  Configuration,
  RegistrationsApi,
} from '';
import type { RegistrationsControllerCancelRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RegistrationsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies RegistrationsControllerCancelRegistrationRequest;

  try {
    const data = await api.registrationsControllerCancelRegistration(body);
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

[**RegistrationApiResponseDto**](RegistrationApiResponseDto.md)

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


## registrationsControllerCreateTournamentRegistration

> RegistrationApiResponseDto registrationsControllerCreateTournamentRegistration(slugOrId, createRegistrationRequestDto)

Register the current player for a public tournament

### Example

```ts
import {
  Configuration,
  RegistrationsApi,
} from '';
import type { RegistrationsControllerCreateTournamentRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RegistrationsApi(config);

  const body = {
    // string
    slugOrId: slugOrId_example,
    // CreateRegistrationRequestDto
    createRegistrationRequestDto: ...,
  } satisfies RegistrationsControllerCreateTournamentRegistrationRequest;

  try {
    const data = await api.registrationsControllerCreateTournamentRegistration(body);
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
| **createRegistrationRequestDto** | [CreateRegistrationRequestDto](CreateRegistrationRequestDto.md) |  | |

### Return type

[**RegistrationApiResponseDto**](RegistrationApiResponseDto.md)

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


## registrationsControllerFindMyRegistrations

> RegistrationListApiResponseDto registrationsControllerFindMyRegistrations()

List registrations for the current player

### Example

```ts
import {
  Configuration,
  RegistrationsApi,
} from '';
import type { RegistrationsControllerFindMyRegistrationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RegistrationsApi(config);

  try {
    const data = await api.registrationsControllerFindMyRegistrations();
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

[**RegistrationListApiResponseDto**](RegistrationListApiResponseDto.md)

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


## registrationsControllerFindRegistration

> RegistrationApiResponseDto registrationsControllerFindRegistration(id)

Get one current-player registration

### Example

```ts
import {
  Configuration,
  RegistrationsApi,
} from '';
import type { RegistrationsControllerFindRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RegistrationsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies RegistrationsControllerFindRegistrationRequest;

  try {
    const data = await api.registrationsControllerFindRegistration(body);
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

[**RegistrationApiResponseDto**](RegistrationApiResponseDto.md)

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

