
# UpdateRegistrationPaymentRequestDto


## Properties

Name | Type
------------ | -------------
`status` | string
`reference` | string
`internalNotes` | string
`paidAt` | string

## Example

```typescript
import type { UpdateRegistrationPaymentRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "status": paid,
  "reference": Cash receipt #A102,
  "internalNotes": Verified at the registration desk.,
  "paidAt": 2026-06-08T04:30:00.000Z,
} satisfies UpdateRegistrationPaymentRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateRegistrationPaymentRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


