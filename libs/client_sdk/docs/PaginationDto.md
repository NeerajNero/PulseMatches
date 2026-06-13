
# PaginationDto


## Properties

Name | Type
------------ | -------------
`page` | number
`limit` | number
`total` | number
`totalPages` | number
`hasNext` | boolean

## Example

```typescript
import type { PaginationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "page": null,
  "limit": null,
  "total": null,
  "totalPages": null,
  "hasNext": null,
} satisfies PaginationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaginationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


