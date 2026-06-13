
# AdminNotificationListDto


## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;AdminNotificationDto&gt;](AdminNotificationDto.md)
`pagination` | [AdminPaginationDto](AdminPaginationDto.md)

## Example

```typescript
import type { AdminNotificationListDto } from ''

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "pagination": null,
} satisfies AdminNotificationListDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminNotificationListDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


