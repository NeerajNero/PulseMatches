
# AdminPaymentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`registrationId` | string
`tournamentId` | string
`tournamentTitle` | string
`player` | [AdminUserSummaryDto](AdminUserSummaryDto.md)
`provider` | string
`mode` | string
`status` | string
`amount` | number
`currency` | string
`paidAt` | string
`refundCount` | number
`refundedAmount` | number
`latestIntentStatus` | string
`eventCount` | number
`updatedAt` | string

## Example

```typescript
import type { AdminPaymentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "registrationId": null,
  "tournamentId": null,
  "tournamentTitle": null,
  "player": null,
  "provider": null,
  "mode": null,
  "status": null,
  "amount": null,
  "currency": null,
  "paidAt": null,
  "refundCount": null,
  "refundedAmount": null,
  "latestIntentStatus": null,
  "eventCount": null,
  "updatedAt": null,
} satisfies AdminPaymentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPaymentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


