
# OrganizerTeamDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tournamentId` | string
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)
`name` | string
`status` | string
`seed` | number
`memberCount` | number
`members` | [Array&lt;OrganizerTeamMemberDto&gt;](OrganizerTeamMemberDto.md)
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerTeamDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tournamentId": null,
  "category": null,
  "name": null,
  "status": active,
  "seed": null,
  "memberCount": null,
  "members": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerTeamDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerTeamDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


