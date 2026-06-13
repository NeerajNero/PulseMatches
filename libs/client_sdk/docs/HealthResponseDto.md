
# HealthResponseDto


## Properties

Name | Type
------------ | -------------
`status` | string
`service` | string
`version` | string
`checkedAt` | string

## Example

```typescript
import type { HealthResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "status": ok,
  "service": matchflow-arena-api,
  "version": 0.1.0,
  "checkedAt": 2026-05-26T00:00:00.000Z,
} satisfies HealthResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


