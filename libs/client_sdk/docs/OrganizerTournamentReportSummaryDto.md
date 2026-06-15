
# OrganizerTournamentReportSummaryDto


## Properties

Name | Type
------------ | -------------
`registrationsByStatus` | [Array&lt;OrganizerReportCountDto&gt;](OrganizerReportCountDto.md)
`paymentsByStatus` | [Array&lt;OrganizerReportCountDto&gt;](OrganizerReportCountDto.md)
`totalCollectedAmount` | number
`totalRefundedAmount` | number
`participantCount` | number
`teamCount` | number
`fixtureCount` | number
`completedMatchCount` | number
`pendingNotificationCount` | number

## Example

```typescript
import type { OrganizerTournamentReportSummaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "registrationsByStatus": null,
  "paymentsByStatus": null,
  "totalCollectedAmount": null,
  "totalRefundedAmount": null,
  "participantCount": null,
  "teamCount": null,
  "fixtureCount": null,
  "completedMatchCount": null,
  "pendingNotificationCount": null,
} satisfies OrganizerTournamentReportSummaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerTournamentReportSummaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


