
# AdminTournamentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`slug` | string
`status` | string
`visibility` | string
`sport` | string
`city` | string
`organizer` | [AdminOrganizerDto](AdminOrganizerDto.md)
`registrationCount` | number
`createdAt` | string

## Example

```typescript
import type { AdminTournamentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "slug": null,
  "status": null,
  "visibility": null,
  "sport": null,
  "city": null,
  "organizer": null,
  "registrationCount": null,
  "createdAt": null,
} satisfies AdminTournamentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminTournamentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


