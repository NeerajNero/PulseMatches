
# AdminDashboardDto


## Properties

Name | Type
------------ | -------------
`totalUsers` | number
`totalOrganizers` | number
`totalTournaments` | number
`publishedTournaments` | number
`draftTournaments` | number
`totalRegistrations` | number
`pendingRegistrations` | number
`paidPayments` | number
`pendingPayments` | number
`failedPayments` | number
`refundCount` | number
`pendingNotifications` | number
`failedNotifications` | number
`recentReconciliationStatus` | string
`recentReconciliationProvider` | string
`recentReconciliationStartedAt` | string

## Example

```typescript
import type { AdminDashboardDto } from ''

// TODO: Update the object below with actual values
const example = {
  "totalUsers": null,
  "totalOrganizers": null,
  "totalTournaments": null,
  "publishedTournaments": null,
  "draftTournaments": null,
  "totalRegistrations": null,
  "pendingRegistrations": null,
  "paidPayments": null,
  "pendingPayments": null,
  "failedPayments": null,
  "refundCount": null,
  "pendingNotifications": null,
  "failedNotifications": null,
  "recentReconciliationStatus": null,
  "recentReconciliationProvider": null,
  "recentReconciliationStartedAt": null,
} satisfies AdminDashboardDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminDashboardDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


