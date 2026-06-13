
# AdminReconciliationRunDto


## Properties

Name | Type
------------ | -------------
`id` | string
`provider` | string
`status` | string
`checkedCount` | number
`updatedCount` | number
`failedCount` | number
`error` | string
`startedAt` | string
`completedAt` | string

## Example

```typescript
import type { AdminReconciliationRunDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "provider": null,
  "status": null,
  "checkedCount": null,
  "updatedCount": null,
  "failedCount": null,
  "error": null,
  "startedAt": null,
  "completedAt": null,
} satisfies AdminReconciliationRunDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminReconciliationRunDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


