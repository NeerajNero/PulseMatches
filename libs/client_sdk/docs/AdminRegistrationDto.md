
# AdminRegistrationDto


## Properties

Name | Type
------------ | -------------
`id` | string
`player` | [AdminUserSummaryDto](AdminUserSummaryDto.md)
`playerName` | string
`tournamentId` | string
`tournamentTitle` | string
`categoryName` | string
`status` | string
`paymentStatus` | string
`createdAt` | string

## Example

```typescript
import type { AdminRegistrationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "player": null,
  "playerName": null,
  "tournamentId": null,
  "tournamentTitle": null,
  "categoryName": null,
  "status": null,
  "paymentStatus": null,
  "createdAt": null,
} satisfies AdminRegistrationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminRegistrationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


