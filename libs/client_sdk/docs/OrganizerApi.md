# OrganizerApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**organizerControllerCreateProfile**](OrganizerApi.md#organizercontrollercreateprofile) | **POST** /organizer/profile | Create current organizer profile |
| [**organizerControllerGetProfile**](OrganizerApi.md#organizercontrollergetprofile) | **GET** /organizer/profile | Get current organizer profile |
| [**organizerControllerUpdateProfile**](OrganizerApi.md#organizercontrollerupdateprofile) | **PATCH** /organizer/profile | Update current organizer profile |



## organizerControllerCreateProfile

> OrganizerProfileApiResponseDto organizerControllerCreateProfile(createOrganizerProfileRequestDto)

Create current organizer profile

### Example

```ts
import {
  Configuration,
  OrganizerApi,
} from '';
import type { OrganizerControllerCreateProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerApi(config);

  const body = {
    // CreateOrganizerProfileRequestDto
    createOrganizerProfileRequestDto: ...,
  } satisfies OrganizerControllerCreateProfileRequest;

  try {
    const data = await api.organizerControllerCreateProfile(body);
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
| **createOrganizerProfileRequestDto** | [CreateOrganizerProfileRequestDto](CreateOrganizerProfileRequestDto.md) |  | |

### Return type

[**OrganizerProfileApiResponseDto**](OrganizerProfileApiResponseDto.md)

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


## organizerControllerGetProfile

> OrganizerProfileApiResponseDto organizerControllerGetProfile()

Get current organizer profile

### Example

```ts
import {
  Configuration,
  OrganizerApi,
} from '';
import type { OrganizerControllerGetProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerApi(config);

  try {
    const data = await api.organizerControllerGetProfile();
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

[**OrganizerProfileApiResponseDto**](OrganizerProfileApiResponseDto.md)

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


## organizerControllerUpdateProfile

> OrganizerProfileApiResponseDto organizerControllerUpdateProfile(updateOrganizerProfileRequestDto)

Update current organizer profile

### Example

```ts
import {
  Configuration,
  OrganizerApi,
} from '';
import type { OrganizerControllerUpdateProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrganizerApi(config);

  const body = {
    // UpdateOrganizerProfileRequestDto
    updateOrganizerProfileRequestDto: ...,
  } satisfies OrganizerControllerUpdateProfileRequest;

  try {
    const data = await api.organizerControllerUpdateProfile(body);
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
| **updateOrganizerProfileRequestDto** | [UpdateOrganizerProfileRequestDto](UpdateOrganizerProfileRequestDto.md) |  | |

### Return type

[**OrganizerProfileApiResponseDto**](OrganizerProfileApiResponseDto.md)

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

