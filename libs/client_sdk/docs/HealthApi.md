# HealthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**healthControllerGetHealth**](HealthApi.md#healthcontrollergethealth) | **GET** /health | Check API health |
| [**healthControllerGetReady**](HealthApi.md#healthcontrollergetready) | **GET** /health/ready | Check API readiness dependencies |



## healthControllerGetHealth

> HealthApiResponseDto healthControllerGetHealth()

Check API health

### Example

```ts
import {
  Configuration,
  HealthApi,
} from '';
import type { HealthControllerGetHealthRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HealthApi();

  try {
    const data = await api.healthControllerGetHealth();
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

[**HealthApiResponseDto**](HealthApiResponseDto.md)

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


## healthControllerGetReady

> HealthReadyApiResponseDto healthControllerGetReady()

Check API readiness dependencies

### Example

```ts
import {
  Configuration,
  HealthApi,
} from '';
import type { HealthControllerGetReadyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HealthApi();

  try {
    const data = await api.healthControllerGetReady();
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

[**HealthReadyApiResponseDto**](HealthReadyApiResponseDto.md)

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

