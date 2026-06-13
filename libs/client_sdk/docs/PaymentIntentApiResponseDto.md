
# PaymentIntentApiResponseDto


## Properties

Name | Type
------------ | -------------
`statusCode` | number
`status` | string
`message` | string
`data` | [PaymentIntentSummaryDto](PaymentIntentSummaryDto.md)
`error` | object

## Example

```typescript
import type { PaymentIntentApiResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "statusCode": 200,
  "status": Success,
  "message": Request successful,
  "data": null,
  "error": null,
} satisfies PaymentIntentApiResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentIntentApiResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


