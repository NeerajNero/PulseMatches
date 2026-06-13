
# UpdateOrganizerProfileRequestDto


## Properties

Name | Type
------------ | -------------
`organizationName` | string
`contactEmail` | string
`contactPhone` | string

## Example

```typescript
import type { UpdateOrganizerProfileRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "organizationName": North Court Club,
  "contactEmail": organizer@example.com,
  "contactPhone": +919999999999,
} satisfies UpdateOrganizerProfileRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateOrganizerProfileRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


