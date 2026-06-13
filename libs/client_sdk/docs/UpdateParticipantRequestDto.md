
# UpdateParticipantRequestDto


## Properties

Name | Type
------------ | -------------
`tournamentCategoryId` | string
`displayName` | string
`email` | string
`phone` | string
`status` | string

## Example

```typescript
import type { UpdateParticipantRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "tournamentCategoryId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "displayName": Aarav Sharma,
  "email": aarav@example.com,
  "phone": +919999999999,
  "status": null,
} satisfies UpdateParticipantRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateParticipantRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


