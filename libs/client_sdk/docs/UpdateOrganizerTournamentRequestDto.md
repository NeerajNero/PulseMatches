
# UpdateOrganizerTournamentRequestDto


## Properties

Name | Type
------------ | -------------
`title` | string
`shortDescription` | string
`description` | string
`sportId` | string
`cityId` | string
`venueId` | string
`startsAt` | string
`endsAt` | string
`registrationOpensAt` | string
`registrationClosesAt` | string
`maxParticipants` | number

## Example

```typescript
import type { UpdateOrganizerTournamentRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "title": Weekend Shuttle Cup,
  "shortDescription": A local weekend tournament.,
  "description": Tournament rules and participation notes.,
  "sportId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "cityId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "venueId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "startsAt": 2026-07-10T04:30:00.000Z,
  "endsAt": 2026-07-11T04:30:00.000Z,
  "registrationOpensAt": 2026-06-10T04:30:00.000Z,
  "registrationClosesAt": 2026-07-05T04:30:00.000Z,
  "maxParticipants": null,
} satisfies UpdateOrganizerTournamentRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateOrganizerTournamentRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


