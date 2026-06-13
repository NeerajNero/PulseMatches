
# OrganizerProfileResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`organizationName` | string
`slug` | string
`contactEmail` | string
`contactPhone` | object
`verificationStatus` | string
`status` | string
`userId` | string
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { OrganizerProfileResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "organizationName": North Court Club,
  "slug": north-court-club,
  "contactEmail": organizer@example.com,
  "contactPhone": +919999999999,
  "verificationStatus": PENDING,
  "status": ACTIVE,
  "userId": 85e9f43b-a6cb-46ee-95e9-bad0955c6308,
  "createdAt": 2026-05-26T00:00:00.000Z,
  "updatedAt": 2026-05-26T00:00:00.000Z,
} satisfies OrganizerProfileResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizerProfileResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


