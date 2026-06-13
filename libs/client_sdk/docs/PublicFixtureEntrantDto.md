
# PublicFixtureEntrantDto


## Properties

Name | Type
------------ | -------------
`slotNumber` | number
`isBye` | boolean
`displayName` | string
`seed` | number
`score` | number
`isWinner` | boolean

## Example

```typescript
import type { PublicFixtureEntrantDto } from ''

// TODO: Update the object below with actual values
const example = {
  "slotNumber": null,
  "isBye": null,
  "displayName": null,
  "seed": null,
  "score": null,
  "isWinner": null,
} satisfies PublicFixtureEntrantDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicFixtureEntrantDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


