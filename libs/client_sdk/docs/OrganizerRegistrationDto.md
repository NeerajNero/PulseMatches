
# OrganizerRegistrationDto


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | string
`paymentMode` | string
`paymentStatus` | string
`feeAmount` | number
`feeCurrency` | string
`playerName` | string
`phone` | string
`notes` | string
`user` | [OrganizerRosterUserSummaryDto](OrganizerRosterUserSummaryDto.md)
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)
`participantId` | string
`registeredAt` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerRegistrationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "status": pending,
  "paymentMode": offline,
  "paymentStatus": pending_offline,
  "feeAmount": null,
  "feeCurrency": null,
  "playerName": null,
  "phone": null,
  "notes": null,
  "user": null,
  "category": null,
  "participantId": null,
  "registeredAt": 2026-06-08T04:30:00.000Z,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerRegistrationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerRegistrationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


