
# RegistrationPaymentDetailDto


## Properties

Name | Type
------------ | -------------
`registrationId` | string
`mode` | string
`status` | string
`amount` | number
`currency` | string
`paidAt` | string
`reference` | string
`offlineInstructions` | string
`onlinePaymentAvailable` | boolean
`latestIntent` | [PaymentIntentSummaryDto](PaymentIntentSummaryDto.md)
`refundCount` | number
`refundedAmount` | number
`latestRefundStatus` | string
`latestRefundProcessedAt` | string

## Example

```typescript
import type { RegistrationPaymentDetailDto } from ''

// TODO: Update the object below with actual values
const example = {
  "registrationId": null,
  "mode": online_provider,
  "status": pending_offline,
  "amount": null,
  "currency": INR,
  "paidAt": null,
  "reference": null,
  "offlineInstructions": null,
  "onlinePaymentAvailable": null,
  "latestIntent": null,
  "refundCount": null,
  "refundedAmount": null,
  "latestRefundStatus": manual_recorded,
  "latestRefundProcessedAt": 2026-06-08T04:30:00.000Z,
} satisfies RegistrationPaymentDetailDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegistrationPaymentDetailDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


