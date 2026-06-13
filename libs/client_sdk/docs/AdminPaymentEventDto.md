
# AdminPaymentEventDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`eventType` | string
`providerEventId` | string
`signatureValid` | boolean
`payloadSummary` | object
`createdAt` | string

## Example

```typescript
import type { AdminPaymentEventDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": null,
  "eventType": null,
  "providerEventId": null,
  "signatureValid": null,
  "payloadSummary": null,
  "createdAt": null,
} satisfies AdminPaymentEventDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPaymentEventDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


