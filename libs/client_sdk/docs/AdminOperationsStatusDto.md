
# AdminOperationsStatusDto


## Properties

Name | Type
------------ | -------------
`status` | string
`serviceName` | string
`appVersion` | string
`checkedAt` | string
`dependencies` | [Array&lt;AdminOperationsDependencyDto&gt;](AdminOperationsDependencyDto.md)
`paymentProvider` | string
`notificationProvider` | string
`exportMaxRows` | number
`pendingNotifications` | number
`failedNotifications` | number
`staleProcessingNotifications` | number
`stalePaymentIntents` | number
`failedPaymentIntents` | number
`failedPaymentEvents` | number
`latestReconciliationRun` | [AdminOperationsLatestReconciliationDto](AdminOperationsLatestReconciliationDto.md)
`thresholds` | [AdminOperationsThresholdDto](AdminOperationsThresholdDto.md)

## Example

```typescript
import type { AdminOperationsStatusDto } from ''

// TODO: Update the object below with actual values
const example = {
  "status": null,
  "serviceName": null,
  "appVersion": null,
  "checkedAt": null,
  "dependencies": null,
  "paymentProvider": null,
  "notificationProvider": null,
  "exportMaxRows": null,
  "pendingNotifications": null,
  "failedNotifications": null,
  "staleProcessingNotifications": null,
  "stalePaymentIntents": null,
  "failedPaymentIntents": null,
  "failedPaymentEvents": null,
  "latestReconciliationRun": null,
  "thresholds": null,
} satisfies AdminOperationsStatusDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminOperationsStatusDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


