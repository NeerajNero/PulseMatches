
# FixtureMatchDto


## Properties

Name | Type
------------ | -------------
`id` | string
`matchNumber` | number
`roundPosition` | number
`status` | string
`scheduledAt` | string
`venueName` | string
`courtName` | string
`notes` | string
`completedAt` | string
`winnerMatchEntrantId` | string
`resultNotes` | string
`entrants` | [Array&lt;FixtureEntrantDto&gt;](FixtureEntrantDto.md)
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { FixtureMatchDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "matchNumber": null,
  "roundPosition": null,
  "status": unscheduled,
  "scheduledAt": null,
  "venueName": null,
  "courtName": null,
  "notes": null,
  "completedAt": null,
  "winnerMatchEntrantId": null,
  "resultNotes": null,
  "entrants": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies FixtureMatchDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FixtureMatchDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


