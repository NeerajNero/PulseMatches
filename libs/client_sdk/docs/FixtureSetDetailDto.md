
# FixtureSetDetailDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tournamentId` | string
`category` | [RegistrationCategorySummaryDto](RegistrationCategorySummaryDto.md)
`format` | string
`entrantType` | string
`status` | string
`name` | string
`matchCount` | number
`scheduledMatchCount` | number
`generatedAt` | string
`publishedAt` | string
`createdAt` | string
`updatedAt` | string
`rounds` | [Array&lt;FixtureRoundDto&gt;](FixtureRoundDto.md)
`standings` | [Array&lt;RoundRobinStandingDto&gt;](RoundRobinStandingDto.md)

## Example

```typescript
import type { FixtureSetDetailDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tournamentId": null,
  "category": null,
  "format": knockout,
  "entrantType": participant,
  "status": generated,
  "name": null,
  "matchCount": null,
  "scheduledMatchCount": null,
  "generatedAt": null,
  "publishedAt": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
  "rounds": null,
  "standings": null,
} satisfies FixtureSetDetailDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FixtureSetDetailDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


