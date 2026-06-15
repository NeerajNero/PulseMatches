
# AdminPlatformReportSummaryDto


## Properties

Name | Type
------------ | -------------
`usersByRole` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)
`organizersByVerificationStatus` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)
`tournamentsByStatus` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)
`registrationsByStatus` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)
`paymentsByProviderStatus` | [Array&lt;AdminPaymentProviderStatusReportDto&gt;](AdminPaymentProviderStatusReportDto.md)
`totalPaidAmount` | number
`totalRefundedAmount` | number
`notificationsByStatus` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)
`reconciliationByStatus` | [Array&lt;AdminReportCountDto&gt;](AdminReportCountDto.md)

## Example

```typescript
import type { AdminPlatformReportSummaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "usersByRole": null,
  "organizersByVerificationStatus": null,
  "tournamentsByStatus": null,
  "registrationsByStatus": null,
  "paymentsByProviderStatus": null,
  "totalPaidAmount": null,
  "totalRefundedAmount": null,
  "notificationsByStatus": null,
  "reconciliationByStatus": null,
} satisfies AdminPlatformReportSummaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPlatformReportSummaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


