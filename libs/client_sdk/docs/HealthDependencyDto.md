
# HealthDependencyDto


## Properties

Name | Type
------------ | -------------
`name` | string
`status` | string

## Example

```typescript
import type { HealthDependencyDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": database,
  "status": ok,
} satisfies HealthDependencyDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthDependencyDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


