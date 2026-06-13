
# OrganizerPaymentEventDiagnosticDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`eventType` | string
`providerEventId` | string
`signatureValid` | boolean
`processedAt` | string
`payloadSummary` | object
`createdAt` | string

## Example

```typescript
import type { OrganizerPaymentEventDiagnosticDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": razorpay,
  "eventType": razorpay.payment.captured,
  "providerEventId": null,
  "signatureValid": null,
  "processedAt": null,
  "payloadSummary": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerPaymentEventDiagnosticDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerPaymentEventDiagnosticDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


