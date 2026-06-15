
# AdminOperationsThresholdDto


## Properties

Name | Type
------------ | -------------
`staleNotificationMinutes` | number
`stalePaymentIntentMinutes` | number
`failedNotificationAlertThreshold` | number
`failedPaymentAlertThreshold` | number

## Example

```typescript
import type { AdminOperationsThresholdDto } from ''

// TODO: Update the object below with actual values
const example = {
  "staleNotificationMinutes": null,
  "stalePaymentIntentMinutes": null,
  "failedNotificationAlertThreshold": null,
  "failedPaymentAlertThreshold": null,
} satisfies AdminOperationsThresholdDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminOperationsThresholdDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


