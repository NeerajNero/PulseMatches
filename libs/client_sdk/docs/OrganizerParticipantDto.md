
# OrganizerParticipantDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tournamentId` | string
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)
`registrationId` | string
`user` | [OrganizerRosterUserSummaryDto](OrganizerRosterUserSummaryDto.md)
`displayName` | string
`email` | string
`phone` | string
`source` | string
`status` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerParticipantDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tournamentId": null,
  "category": null,
  "registrationId": null,
  "user": null,
  "displayName": null,
  "email": null,
  "phone": null,
  "source": manual,
  "status": active,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerParticipantDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerParticipantDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


