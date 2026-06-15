
# HealthEnvCheckDto


## Properties

Name | Type
------------ | -------------
`name` | string
`configured` | boolean

## Example

```typescript
import type { HealthEnvCheckDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": DATABASE_URL,
  "configured": true,
} satisfies HealthEnvCheckDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthEnvCheckDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


