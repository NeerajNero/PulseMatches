
# AdminPaymentIntentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`mode` | string
`status` | string
`amount` | number
`currency` | string
`providerIntentId` | string
`expiresAt` | string
`attempts` | [Array&lt;AdminPaymentAttemptDto&gt;](AdminPaymentAttemptDto.md)
`events` | [Array&lt;AdminPaymentEventDto&gt;](AdminPaymentEventDto.md)
`createdAt` | string

## Example

```typescript
import type { AdminPaymentIntentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": null,
  "mode": null,
  "status": null,
  "amount": null,
  "currency": null,
  "providerIntentId": null,
  "expiresAt": null,
  "attempts": null,
  "events": null,
  "createdAt": null,
} satisfies AdminPaymentIntentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPaymentIntentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


