
# OrganizerTeamMemberDto


## Properties

Name | Type
------------ | -------------
`id` | string
`teamId` | string
`participantId` | string
`userId` | string
`displayName` | string
`email` | string
`phone` | string
`role` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerTeamMemberDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "teamId": null,
  "participantId": null,
  "userId": null,
  "displayName": null,
  "email": null,
  "phone": null,
  "role": player,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerTeamMemberDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerTeamMemberDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


