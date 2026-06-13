
# RegistrationPaymentSummaryDto


## Properties

Name | Type
------------ | -------------
`mode` | string
`status` | string
`amount` | number
`currency` | string
`offlineInstructions` | string
`paidAt` | string
`onlinePaymentAvailable` | boolean
`provider` | string
`latestIntentStatus` | string
`latestIntentId` | string
`checkoutUrl` | string
`eventCount` | number
`refundCount` | number
`refundedAmount` | number
`latestRefundStatus` | string
`latestRefundProcessedAt` | string

## Example

```typescript
import type { RegistrationPaymentSummaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "mode": offline,
  "status": pending_offline,
  "amount": null,
  "currency": INR,
  "offlineInstructions": Offline payment can be completed with the organizer at the venue.,
  "paidAt": 2026-06-08T04:30:00.000Z,
  "onlinePaymentAvailable": null,
  "provider": mock,
  "latestIntentStatus": requires_action,
  "latestIntentId": null,
  "checkoutUrl": null,
  "eventCount": null,
  "refundCount": null,
  "refundedAmount": null,
  "latestRefundStatus": manual_recorded,
  "latestRefundProcessedAt": 2026-06-08T04:30:00.000Z,
} satisfies RegistrationPaymentSummaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegistrationPaymentSummaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


