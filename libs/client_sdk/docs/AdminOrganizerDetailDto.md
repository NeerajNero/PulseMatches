
# AdminOrganizerDetailDto


## Properties

Name | Type
------------ | -------------
`id` | string
`organizationName` | string
`slug` | string
`verificationStatus` | string
`status` | string
`user` | [AdminUserSummaryDto](AdminUserSummaryDto.md)
`tournamentCount` | number
`createdAt` | string
`tournaments` | [Array&lt;AdminOrganizerTournamentSummaryDto&gt;](AdminOrganizerTournamentSummaryDto.md)
`auditEvents` | [Array&lt;AdminAuditEventDto&gt;](AdminAuditEventDto.md)

## Example

```typescript
import type { AdminOrganizerDetailDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "organizationName": null,
  "slug": null,
  "verificationStatus": null,
  "status": null,
  "user": null,
  "tournamentCount": null,
  "createdAt": null,
  "tournaments": null,
  "auditEvents": null,
} satisfies AdminOrganizerDetailDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminOrganizerDetailDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


