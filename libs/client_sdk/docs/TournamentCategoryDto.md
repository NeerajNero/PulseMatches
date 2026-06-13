
# TournamentCategoryDto


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`code` | string
`formatType` | string
`participantType` | string
`genderType` | string
`minAge` | number
`maxAge` | number
`entryFeeAmount` | number
`entryFeeCurrency` | string
`capacity` | number
`status` | string

## Example

```typescript
import type { TournamentCategoryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "code": null,
  "formatType": knockout,
  "participantType": singles,
  "genderType": open,
  "minAge": null,
  "maxAge": null,
  "entryFeeAmount": null,
  "entryFeeCurrency": INR,
  "capacity": null,
  "status": active,
} satisfies TournamentCategoryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TournamentCategoryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


