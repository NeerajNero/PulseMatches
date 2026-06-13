
# FixtureRoundDto


## Properties

Name | Type
------------ | -------------
`id` | string
`roundNumber` | number
`name` | string
`stage` | string
`matches` | [Array&lt;FixtureMatchDto&gt;](FixtureMatchDto.md)
`createdAt` | string
`updatedAt` | string

## Example

```typescript
import type { FixtureRoundDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "roundNumber": null,
  "name": null,
  "stage": final,
  "matches": null,
  "createdAt": 2026-06-08T04:30:00.000Z,
  "updatedAt": 2026-06-08T04:30:00.000Z,
} satisfies FixtureRoundDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FixtureRoundDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


