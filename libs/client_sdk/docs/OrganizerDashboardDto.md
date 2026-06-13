
# OrganizerDashboardDto


## Properties

Name | Type
------------ | -------------
`totalTournaments` | number
`draftTournaments` | number
`publishedTournaments` | number
`upcomingTournaments` | number
`totalRegistrations` | number
`pendingRegistrations` | number
`recentTournaments` | [Array&lt;OrganizerTournamentDto&gt;](OrganizerTournamentDto.md)

## Example

```typescript
import type { OrganizerDashboardDto } from ''

// TODO: Update the object below with actual values
const example = {
  "totalTournaments": null,
  "draftTournaments": null,
  "publishedTournaments": null,
  "upcomingTournaments": null,
  "totalRegistrations": null,
  "pendingRegistrations": null,
  "recentTournaments": null,
} satisfies OrganizerDashboardDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerDashboardDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


