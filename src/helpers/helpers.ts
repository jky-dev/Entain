import { Race, RacesResponse, categories } from '../types/types'

const elapsedTimeForInvalid = -60000

export const isValidTime = (
  startTimeInSeconds: number,
  currentDate: Date
): boolean => {
  const millisecondsUntilStart =
    startTimeInSeconds * 1000 - currentDate.getTime()

  return millisecondsUntilStart > elapsedTimeForInvalid
}

export const constructSortedListOfRaces = (
  response: RacesResponse,
  time: Date
): Race[] => {
  const races: Race[] = []

  for (const key in response.data.race_summaries) {
    const race: Race = response.data.race_summaries[key]

    const categoryName = categories[race.category_id]
    if (
      categoryName === undefined ||
      !isValidTime(race.advertised_start.seconds, time)
    ) {
      continue
    }

    races.push(race)
  }

  return races.sort(
    (a, b) => a.advertised_start.seconds - b.advertised_start.seconds
  )
}
