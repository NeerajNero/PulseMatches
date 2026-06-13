# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authControllerLogin**](AuthApi.md#authcontrollerlogin) | **POST** /auth/login | Log in with email and password |
| [**authControllerLogout**](AuthApi.md#authcontrollerlogout) | **POST** /auth/logout | Log out and revoke a refresh token when provided |
| [**authControllerMe**](AuthApi.md#authcontrollerme) | **GET** /auth/me | Get the current authenticated user |
| [**authControllerRefresh**](AuthApi.md#authcontrollerrefresh) | **POST** /auth/refresh | Refresh an access token |
| [**authControllerSignup**](AuthApi.md#authcontrollersignup) | **POST** /auth/signup | Create a player or organizer account |



## authControllerLogin

> AuthApiResponseDto authControllerLogin(loginRequestDto)

Log in with email and password

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // LoginRequestDto
    loginRequestDto: ...,
  } satisfies AuthControllerLoginRequest;

  try {
    const data = await api.authControllerLogin(body);
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
| **loginRequestDto** | [LoginRequestDto](LoginRequestDto.md) |  | |

### Return type

[**AuthApiResponseDto**](AuthApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerLogout

> LogoutApiResponseDto authControllerLogout(logoutRequestDto)

Log out and revoke a refresh token when provided

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerLogoutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  const body = {
    // LogoutRequestDto
    logoutRequestDto: ...,
  } satisfies AuthControllerLogoutRequest;

  try {
    const data = await api.authControllerLogout(body);
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
| **logoutRequestDto** | [LogoutRequestDto](LogoutRequestDto.md) |  | |

### Return type

[**LogoutApiResponseDto**](LogoutApiResponseDto.md)

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


## authControllerMe

> CurrentUserApiResponseDto authControllerMe()

Get the current authenticated user

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.authControllerMe();
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

[**CurrentUserApiResponseDto**](CurrentUserApiResponseDto.md)

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


## authControllerRefresh

> AuthApiResponseDto authControllerRefresh(refreshRequestDto)

Refresh an access token

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerRefreshRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RefreshRequestDto
    refreshRequestDto: ...,
  } satisfies AuthControllerRefreshRequest;

  try {
    const data = await api.authControllerRefresh(body);
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
| **refreshRequestDto** | [RefreshRequestDto](RefreshRequestDto.md) |  | |

### Return type

[**AuthApiResponseDto**](AuthApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerSignup

> AuthApiResponseDto authControllerSignup(signupRequestDto)

Create a player or organizer account

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerSignupRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // SignupRequestDto
    signupRequestDto: ...,
  } satisfies AuthControllerSignupRequest;

  try {
    const data = await api.authControllerSignup(body);
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
| **signupRequestDto** | [SignupRequestDto](SignupRequestDto.md) |  | |

### Return type

[**AuthApiResponseDto**](AuthApiResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

