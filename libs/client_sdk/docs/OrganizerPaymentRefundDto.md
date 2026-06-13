
# OrganizerPaymentRefundDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`status` | string
`amount` | number
`currency` | string
`reason` | string
`internalNotes` | string
`providerRefundId` | string
`processedAt` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerPaymentRefundDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": manual,
  "status": manual_recorded,
  "amount": null,
  "currency": INR,
  "reason": null,
  "internalNotes": null,
  "providerRefundId": null,
  "processedAt": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerPaymentRefundDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerPaymentRefundDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


