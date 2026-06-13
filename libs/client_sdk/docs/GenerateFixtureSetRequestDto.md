
# GenerateFixtureSetRequestDto


## Properties

Name | Type
------------ | -------------
`format` | string
`entrantType` | string
`name` | string
`replaceExisting` | boolean

## Example

```typescript
import type { GenerateFixtureSetRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "format": KNOCKOUT,
  "entrantType": PARTICIPANT,
  "name": Main draw,
  "replaceExisting": null,
} satisfies GenerateFixtureSetRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GenerateFixtureSetRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


