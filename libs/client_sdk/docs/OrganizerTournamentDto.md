
# OrganizerTournamentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`slug` | string
`title` | string
`shortDescription` | string
`description` | string
`sport` | [SportDto](SportDto.md)
`city` | [CityDto](CityDto.md)
`venue` | [VenueDto](VenueDto.md)
`startsAt` | string
`endsAt` | string
`registrationOpensAt` | string
`registrationClosesAt` | string
`maxParticipants` | number
`publishedAt` | string
`status` | string
`visibility` | string
`registrationCount` | number
`pendingRegistrationCount` | number
`categories` | [Array&lt;TournamentCategoryDto&gt;](TournamentCategoryDto.md)
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerTournamentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "slug": null,
  "title": null,
  "shortDescription": null,
  "description": null,
  "sport": null,
  "city": null,
  "venue": null,
  "startsAt": 2026-07-10T04:30:00.000Z,
  "endsAt": 2026-07-11T04:30:00.000Z,
  "registrationOpensAt": null,
  "registrationClosesAt": null,
  "maxParticipants": null,
  "publishedAt": null,
  "status": draft,
  "visibility": public,
  "registrationCount": null,
  "pendingRegistrationCount": null,
  "categories": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerTournamentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerTournamentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


