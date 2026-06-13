
# OrganizerPaymentAttemptDiagnosticDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`status` | string
`providerAttemptId` | string
`errorCode` | string
`errorMessage` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerPaymentAttemptDiagnosticDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": razorpay,
  "status": redirected,
  "providerAttemptId": null,
  "errorCode": null,
  "errorMessage": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies OrganizerPaymentAttemptDiagnosticDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerPaymentAttemptDiagnosticDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


