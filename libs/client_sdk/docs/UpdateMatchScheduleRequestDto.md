
# UpdateMatchScheduleRequestDto


## Properties

Name | Type
------------ | -------------
`scheduledAt` | string
`venueName` | string
`courtName` | string
`notes` | string
`status` | string

## Example

```typescript
import type { UpdateMatchScheduleRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "scheduledAt": 2026-06-12T09:30:00.000Z,
  "venueName": Kanteerava Indoor Stadium,
  "courtName": Court 2,
  "notes": Open warmup 10 minutes before start.,
  "status": null,
} satisfies UpdateMatchScheduleRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateMatchScheduleRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


