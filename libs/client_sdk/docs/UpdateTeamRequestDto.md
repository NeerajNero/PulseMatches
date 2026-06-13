
# UpdateTeamRequestDto


## Properties

Name | Type
------------ | -------------
`tournamentCategoryId` | string
`name` | string
`status` | string
`seed` | number

## Example

```typescript
import type { UpdateTeamRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "tournamentCategoryId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "name": Court Kings,
  "status": null,
  "seed": null,
} satisfies UpdateTeamRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateTeamRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


