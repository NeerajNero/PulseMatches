
# VerifyRazorpayPaymentRequestDto


## Properties

Name | Type
------------ | -------------
`razorpayOrderId` | string
`razorpayPaymentId` | string
`razorpaySignature` | string

## Example

```typescript
import type { VerifyRazorpayPaymentRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "razorpayOrderId": null,
  "razorpayPaymentId": null,
  "razorpaySignature": null,
} satisfies VerifyRazorpayPaymentRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VerifyRazorpayPaymentRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


