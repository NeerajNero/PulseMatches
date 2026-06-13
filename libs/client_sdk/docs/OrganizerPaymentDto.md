
# OrganizerPaymentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`registrationId` | string
`user` | [OrganizerRosterUserSummaryDto](OrganizerRosterUserSummaryDto.md)
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)
`registrationStatus` | string
`paymentMode` | string
`paymentStatus` | string
`amount` | number
`currency` | string
`playerName` | string
`playerEmail` | string
`reference` | string
`internalNotes` | string
`paidAt` | string
`paymentProvider` | string
`latestIntentStatus` | string
`latestIntentProvider` | string
`latestIntentReference` | string
`latestIntentEventCount` | number
`refundCount` | number
`refundedAmount` | number
`latestRefundStatus` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerPaymentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "registrationId": null,
  "user": null,
  "category": null,
  "registrationStatus": pending,
  "paymentMode": offline,
  "paymentStatus": pending_offline,
  "amount": null,
  "currency": INR,
  "playerName": null,
  "playerEmail": null,
  "reference": null,
  "internalNotes": null,
  "paidAt": null,
  "paymentProvider": mock,
  "latestIntentStatus": requires_action,
  "latestIntentProvider": mock,
  "latestIntentReference": null,
  "latestIntentEventCount": null,
  "refundCount": null,
  "refundedAmount": null,
  "latestRefundStatus": manual_recorded,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerPaymentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerPaymentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


