import { RacesResponse } from '../types/types'
import fixture from './../fixtures/apiFixture.json'

export const getRaces = async (): Promise<RacesResponse> => {
  const response = await fetch(
    'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=50',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const body: RacesResponse = await response.json()

  return body
}

export const getRacesMock = (): Promise<RacesResponse> => {
  const mockRaces: RacesResponse = fixture
  for (const race in mockRaces.data.race_summaries) {
    mockRaces.data.race_summaries[race].advertised_start.seconds =
      Math.floor(new Date().getTime() / 1000) - 55
  }
  return Promise.resolve(mockRaces as RacesResponse)
}
