
# PaymentIntentSummaryDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`mode` | string
`status` | string
`amount` | number
`checkoutAmount` | number
`currency` | string
`providerIntentId` | string
`checkoutUrl` | string
`checkoutKeyId` | string
`checkoutOrderId` | string
`checkoutName` | string
`checkoutDescription` | string
`prefillName` | string
`prefillEmail` | string
`expiresAt` | string
`eventCount` | number
`attemptCount` | number
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { PaymentIntentSummaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": mock,
  "mode": online,
  "status": requires_action,
  "amount": null,
  "checkoutAmount": null,
  "currency": INR,
  "providerIntentId": null,
  "checkoutUrl": null,
  "checkoutKeyId": null,
  "checkoutOrderId": null,
  "checkoutName": null,
  "checkoutDescription": null,
  "prefillName": null,
  "prefillEmail": null,
  "expiresAt": null,
  "eventCount": null,
  "attemptCount": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies PaymentIntentSummaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentIntentSummaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


