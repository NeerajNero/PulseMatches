# PaymentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**paymentsControllerCompleteMockPayment**](PaymentsApi.md#paymentscontrollercompletemockpayment) | **POST** /payments/mock/complete | Complete a mock payment intent for the current player in non-production environments |
| [**paymentsControllerCreatePaymentIntent**](PaymentsApi.md#paymentscontrollercreatepaymentintent) | **POST** /me/registrations/{registrationId}/payment-intent | Create or return an online payment intent for the current player\&#39;s registration |
| [**paymentsControllerFindRegistrationPayment**](PaymentsApi.md#paymentscontrollerfindregistrationpayment) | **GET** /me/registrations/{registrationId}/payment | Get a safe current-player registration payment summary |
| [**paymentsControllerHandleWebhook**](PaymentsApi.md#paymentscontrollerhandlewebhook) | **POST** /payments/webhooks/{provider} | Provider-neutral payment webhook endpoint |
| [**paymentsControllerVerifyRazorpayPayment**](PaymentsApi.md#paymentscontrollerverifyrazorpaypayment) | **POST** /me/registrations/{registrationId}/payment/verify | Verify Razorpay Checkout payment success for the current player\&#39;s registration |



## paymentsControllerCompleteMockPayment

> PaymentIntentApiResponseDto paymentsControllerCompleteMockPayment(mockCompletePaymentRequestDto)

Complete a mock payment intent for the current player in non-production environments

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentsControllerCompleteMockPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentsApi(config);

  const body = {
    // MockCompletePaymentRequestDto
    mockCompletePaymentRequestDto: ...,
  } satisfies PaymentsControllerCompleteMockPaymentRequest;

  try {
    const data = await api.paymentsControllerCompleteMockPayment(body);
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
| **mockCompletePaymentRequestDto** | [MockCompletePaymentRequestDto](MockCompletePaymentRequestDto.md) |  | |

### Return type

[**PaymentIntentApiResponseDto**](PaymentIntentApiResponseDto.md)

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


## paymentsControllerCreatePaymentIntent

> PaymentIntentApiResponseDto paymentsControllerCreatePaymentIntent(registrationId)

Create or return an online payment intent for the current player\&#39;s registration

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentsControllerCreatePaymentIntentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentsApi(config);

  const body = {
    // string
    registrationId: registrationId_example,
  } satisfies PaymentsControllerCreatePaymentIntentRequest;

  try {
    const data = await api.paymentsControllerCreatePaymentIntent(body);
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
| **registrationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PaymentIntentApiResponseDto**](PaymentIntentApiResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## paymentsControllerFindRegistrationPayment

> RegistrationPaymentDetailApiResponseDto paymentsControllerFindRegistrationPayment(registrationId)

Get a safe current-player registration payment summary

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentsControllerFindRegistrationPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentsApi(config);

  const body = {
    // string
    registrationId: registrationId_example,
  } satisfies PaymentsControllerFindRegistrationPaymentRequest;

  try {
    const data = await api.paymentsControllerFindRegistrationPayment(body);
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
| **registrationId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**RegistrationPaymentDetailApiResponseDto**](RegistrationPaymentDetailApiResponseDto.md)

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


## paymentsControllerHandleWebhook

> PaymentIntentApiResponseDto paymentsControllerHandleWebhook(provider, xRazorpaySignature, xRazorpayEventId)

Provider-neutral payment webhook endpoint

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentsControllerHandleWebhookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // string
    provider: provider_example,
    // string (optional)
    xRazorpaySignature: xRazorpaySignature_example,
    // string (optional)
    xRazorpayEventId: xRazorpayEventId_example,
  } satisfies PaymentsControllerHandleWebhookRequest;

  try {
    const data = await api.paymentsControllerHandleWebhook(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |
| **xRazorpaySignature** | `string` |  | [Optional] [Defaults to `undefined`] |
| **xRazorpayEventId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PaymentIntentApiResponseDto**](PaymentIntentApiResponseDto.md)

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


## paymentsControllerVerifyRazorpayPayment

> PaymentIntentApiResponseDto paymentsControllerVerifyRazorpayPayment(registrationId, verifyRazorpayPaymentRequestDto)

Verify Razorpay Checkout payment success for the current player\&#39;s registration

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentsControllerVerifyRazorpayPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PaymentsApi(config);

  const body = {
    // string
    registrationId: registrationId_example,
    // VerifyRazorpayPaymentRequestDto
    verifyRazorpayPaymentRequestDto: ...,
  } satisfies PaymentsControllerVerifyRazorpayPaymentRequest;

  try {
    const data = await api.paymentsControllerVerifyRazorpayPayment(body);
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
| **registrationId** | `string` |  | [Defaults to `undefined`] |
| **verifyRazorpayPaymentRequestDto** | [VerifyRazorpayPaymentRequestDto](VerifyRazorpayPaymentRequestDto.md) |  | |

### Return type

[**PaymentIntentApiResponseDto**](PaymentIntentApiResponseDto.md)

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

