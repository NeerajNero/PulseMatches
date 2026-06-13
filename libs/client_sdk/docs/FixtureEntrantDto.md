
# FixtureEntrantDto


## Properties

Name | Type
------------ | -------------
`id` | string
`slotNumber` | number
`isBye` | boolean
`participantId` | string
`teamId` | string
`displayName` | string
`seed` | number
`score` | number
`isWinner` | boolean

## Example

```typescript
import type { FixtureEntrantDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "slotNumber": null,
  "isBye": null,
  "participantId": null,
  "teamId": null,
  "displayName": null,
  "seed": null,
  "score": null,
  "isWinner": null,
} satisfies FixtureEntrantDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FixtureEntrantDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


