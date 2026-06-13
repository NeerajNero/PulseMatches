
# PublicFixtureRoundDto


## Properties

Name | Type
------------ | -------------
`roundNumber` | number
`name` | string
`stage` | string
`matches` | [Array&lt;PublicFixtureMatchDto&gt;](PublicFixtureMatchDto.md)

## Example

```typescript
import type { PublicFixtureRoundDto } from ''

// TODO: Update the object below with actual values
const example = {
  "roundNumber": null,
  "name": null,
  "stage": final,
  "matches": null,
} satisfies PublicFixtureRoundDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicFixtureRoundDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


