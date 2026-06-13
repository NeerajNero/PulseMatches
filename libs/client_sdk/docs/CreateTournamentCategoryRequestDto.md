
# CreateTournamentCategoryRequestDto


## Properties

Name | Type
------------ | -------------
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

## Example

```typescript
import type { CreateTournamentCategoryRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Open Singles,
  "code": open-singles,
  "formatType": KNOCKOUT,
  "participantType": SINGLES,
  "genderType": OPEN,
  "minAge": null,
  "maxAge": null,
  "entryFeeAmount": null,
  "entryFeeCurrency": INR,
  "capacity": null,
} satisfies CreateTournamentCategoryRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateTournamentCategoryRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


