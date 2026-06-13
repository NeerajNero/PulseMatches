
# OrganizerPaymentIntentDiagnosticDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`mode` | string
`status` | string
`amount` | number
`currency` | string
`providerIntentId` | string
`expiresAt` | string
`eventCount` | number
`attemptCount` | number
`attempts` | [Array&lt;OrganizerPaymentAttemptDiagnosticDto&gt;](OrganizerPaymentAttemptDiagnosticDto.md)
`events` | [Array&lt;OrganizerPaymentEventDiagnosticDto&gt;](OrganizerPaymentEventDiagnosticDto.md)
`refunds` | [Array&lt;OrganizerPaymentRefundDto&gt;](OrganizerPaymentRefundDto.md)
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerPaymentIntentDiagnosticDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": razorpay,
  "mode": online,
  "status": requires_action,
  "amount": null,
  "currency": INR,
  "providerIntentId": null,
  "expiresAt": null,
  "eventCount": null,
  "attemptCount": null,
  "attempts": null,
  "events": null,
  "refunds": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerPaymentIntentDiagnosticDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerPaymentIntentDiagnosticDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


