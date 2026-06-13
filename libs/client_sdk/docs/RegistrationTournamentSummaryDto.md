
# RegistrationTournamentSummaryDto


## Properties

Name | Type
------------ | -------------
`id` | string
`slug` | string
`title` | string
`sport` | [SportDto](SportDto.md)
`city` | [CityDto](CityDto.md)
`venue` | [VenueDto](VenueDto.md)
`organizer` | [OrganizerSummaryDto](OrganizerSummaryDto.md)
`startsAt` | string
`endsAt` | string

## Example

```typescript
import type { RegistrationTournamentSummaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "slug": null,
  "title": null,
  "sport": null,
  "city": null,
  "venue": null,
  "organizer": null,
  "startsAt": 2026-06-10T04:30:00.000Z,
  "endsAt": 2026-06-11T04:30:00.000Z,
} satisfies RegistrationTournamentSummaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegistrationTournamentSummaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


