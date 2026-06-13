
# SignupRequestDto


## Properties

Name | Type
------------ | -------------
`email` | string
`password` | string
`displayName` | string
`role` | string
`organizationName` | string
`contactPhone` | string

## Example

```typescript
import type { SignupRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "email": player@example.com,
  "password": ChangeMe123!,
  "displayName": Aarav Sharma,
  "role": player,
  "organizationName": North Court Club,
  "contactPhone": +919999999999,
} satisfies SignupRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SignupRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


