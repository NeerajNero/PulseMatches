
# UpdateMatchScoreRequestDto


## Properties

Name | Type
------------ | -------------
`scores` | [Array&lt;MatchScoreInputDto&gt;](MatchScoreInputDto.md)
`winnerMatchEntrantId` | string
`allowDraw` | boolean
`resultNotes` | string

## Example

```typescript
import type { UpdateMatchScoreRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "scores": null,
  "winnerMatchEntrantId": f2da9642-a695-4d96-8f98-71a0f668c9b1,
  "allowDraw": null,
  "resultNotes": null,
} satisfies UpdateMatchScoreRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateMatchScoreRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


