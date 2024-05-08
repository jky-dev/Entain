export const CategoriesMap: { [key: string]: CategoryType } = {
  '9daef0d7-bf3c-4f50-921d-8e818c60fe61': 'Greyhound Racing',
  '161d9be2-e909-4326-8c2c-35ed71fb460b': 'Harness Racing',
  '4a2788f8-e825-4d36-9894-efd4baf1cfae': 'Horse Racing',
}

// simplified types since we only care about these values
export interface RacesResponse {
  status: number
  data: {
    race_summaries: {
      [key: string]: Race
    }
  }
}

export interface Race {
  race_id: string
  race_number: number
  meeting_name: string
  category_id: string
  advertised_start: {
    seconds: number
  }
}

export type CategoryType =
  | 'Greyhound Racing'
  | 'Harness Racing'
  | 'Horse Racing'
