
# CurrentUserDto


## Properties

Name | Type
------------ | -------------
`id` | string
`email` | string
`displayName` | string
`roles` | Array&lt;string&gt;
`status` | string
`organizerProfile` | [OrganizerProfileSummaryDto](OrganizerProfileSummaryDto.md)

## Example

```typescript
import type { CurrentUserDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "email": player@example.com,
  "displayName": Aarav Sharma,
  "roles": ["PLAYER"],
  "status": ACTIVE,
  "organizerProfile": null,
} satisfies CurrentUserDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CurrentUserDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


