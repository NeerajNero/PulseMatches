
# CreatePaymentRefundRequestDto


## Properties

Name | Type
------------ | -------------
`amount` | number
`status` | string
`reason` | string
`internalNotes` | string

## Example

```typescript
import type { CreatePaymentRefundRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": 750,
  "status": null,
  "reason": Player withdrew before brackets were created.,
  "internalNotes": Cash returned at registration desk.,
} satisfies CreatePaymentRefundRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePaymentRefundRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


