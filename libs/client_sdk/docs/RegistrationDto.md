
# RegistrationDto


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | string
`paymentMode` | string
`paymentStatus` | string
`feeAmount` | number
`feeCurrency` | string
`payment` | [RegistrationPaymentSummaryDto](RegistrationPaymentSummaryDto.md)
`playerName` | string
`phone` | string
`notes` | string
`registeredAt` | string
`cancelledAt` | string
`createdAt` | string
`updatedAt` | string
`tournament` | [RegistrationTournamentSummaryDto](RegistrationTournamentSummaryDto.md)
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)

## Example

```typescript
import type { RegistrationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "status": pending,
  "paymentMode": offline,
  "paymentStatus": pending_offline,
  "feeAmount": null,
  "feeCurrency": INR,
  "payment": null,
  "playerName": null,
  "phone": null,
  "notes": null,
  "registeredAt": 2026-06-08T04:30:00.000Z,
  "cancelledAt": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
  "tournament": null,
  "category": null,
} satisfies RegistrationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegistrationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


