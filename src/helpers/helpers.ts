import { CategoriesMap, Race, RacesResponse } from '../types/types'

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

    const categoryName = CategoriesMap[race.category_id]
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

export const timeString = (seconds: number): string => {
  if (seconds >= 0) {
    const minutes = Math.floor(seconds / 60)
    const secondsLeft = seconds % 60

    if (minutes > 0) {
      return `In ${minutes} minute${
        minutes !== 1 ? 's' : ''
      }, ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''}`
    }

    return `In ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''}`
  }

  const positiveSeconds = Math.abs(seconds)

  return `${positiveSeconds} second${positiveSeconds !== 1 ? 's' : ''} ago`
}

export const removeInvalidEntries = (
  sortedArray: Race[],
  time: Date,
  onRemove: () => void
) => {
  if (sortedArray.length === 0) return
  let counter = 0

  while (!isValidTime(sortedArray[0].advertised_start.seconds, time)) {
    sortedArray.shift()
    counter++
  }
  if (counter !== 0) {
    onRemove()
  }
}
