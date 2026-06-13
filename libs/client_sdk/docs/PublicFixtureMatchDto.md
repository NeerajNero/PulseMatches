
# PublicFixtureMatchDto


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
`completedAt` | string
`winnerSlotNumber` | number
`entrants` | [Array&lt;PublicFixtureEntrantDto&gt;](PublicFixtureEntrantDto.md)

## Example

```typescript
import type { PublicFixtureMatchDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "matchNumber": null,
  "roundPosition": null,
  "status": scheduled,
  "scheduledAt": null,
  "venueName": null,
  "courtName": null,
  "completedAt": null,
  "winnerSlotNumber": null,
  "entrants": null,
} satisfies PublicFixtureMatchDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicFixtureMatchDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


