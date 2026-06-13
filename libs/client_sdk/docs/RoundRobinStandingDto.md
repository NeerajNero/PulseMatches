
# RoundRobinStandingDto


## Properties

Name | Type
------------ | -------------
`entrantId` | string
`entrantType` | string
`displayName` | string
`played` | number
`wins` | number
`draws` | number
`losses` | number
`points` | number
`scoreFor` | number
`scoreAgainst` | number
`scoreDifference` | number

## Example

```typescript
import type { RoundRobinStandingDto } from ''

// TODO: Update the object below with actual values
const example = {
  "entrantId": null,
  "entrantType": participant,
  "displayName": null,
  "played": null,
  "wins": null,
  "draws": null,
  "losses": null,
  "points": null,
  "scoreFor": null,
  "scoreAgainst": null,
  "scoreDifference": null,
} satisfies RoundRobinStandingDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RoundRobinStandingDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


