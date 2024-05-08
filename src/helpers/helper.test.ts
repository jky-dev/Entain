import { Race } from '../types/types'
import {
  constructSortedListOfRaces,
  isValidTime,
  removeInvalidEntries,
  timeString,
} from './helpers'

describe('helpers', () => {
  describe('Is Valid Time', () => {
    it('should return true if the start time is in the future', () => {
      const currentDate = new Date()

      const dateInTheFuture = currentDate.getTime() + 50000

      const futureDateInSeconds = Math.floor(dateInTheFuture / 1000)

      expect(isValidTime(futureDateInSeconds, currentDate)).toBe(true)
    })

    it('should return true if the start time is right now', () => {
      const currentDate = new Date()
      const dateInSeconds = Math.floor(currentDate.getTime() / 1000)

      expect(isValidTime(dateInSeconds, currentDate)).toBe(true)
    })

    it('should return true if the start time is 59 seconds ago', () => {
      const currentDate = new Date()

      const pastDate = currentDate.getTime() - 59000

      const pastDateInSeconds = Math.floor(pastDate / 1000)

      expect(isValidTime(pastDateInSeconds, currentDate)).toBe(true)
    })

    it('should return false if the start time is 60 seconds ago', () => {
      const currentDate = new Date()

      const pastDate = currentDate.getTime() - 60000

      const pastDateInSeconds = Math.floor(pastDate / 1000)

      expect(isValidTime(pastDateInSeconds, currentDate)).toBe(false)
    })

    it('should return false if the start time is 100 seconds ago', () => {
      const currentDate = new Date()

      const pastDate = currentDate.getTime() - 100000

      const pastDateInSeconds = Math.floor(pastDate / 1000)

      expect(isValidTime(pastDateInSeconds, currentDate)).toBe(false)
    })
  })

  describe('Construct Sorted List', () => {
    it('should sort correctly', () => {
      const currentDate = new Date()
      const currentDateInSeconds = Math.floor(currentDate.getTime() / 1000)

      const raceResponse = {
        status: 200,
        data: {
          race_summaries: {
            '1': {
              race_id: '1',
              race_number: 7,
              meeting_name: 'Swindon Bags',
              category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
              advertised_start: { seconds: currentDateInSeconds + 5 },
            },
            '2': {
              race_id: '2',
              race_number: 5,
              meeting_name: 'Finger Lakes',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 6 },
            },
            '3': {
              race_id: '3',
              race_number: 6,
              meeting_name: 'Hereford',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 3 },
            },
          },
        },
      }

      const sortedList = constructSortedListOfRaces(raceResponse, currentDate)
      expect(sortedList.length).toBe(3)
      expect(sortedList[0].meeting_name).toBe('Hereford')
      expect(sortedList[1].meeting_name).toBe('Swindon Bags')
      expect(sortedList[2].meeting_name).toBe('Finger Lakes')
    })

    it('should exclude invalid categories', () => {
      const currentDate = new Date()
      const currentDateInSeconds = Math.floor(currentDate.getTime() / 1000)

      const raceResponse = {
        status: 200,
        data: {
          race_summaries: {
            '1': {
              race_id: '1',
              race_number: 7,
              meeting_name: 'Swindon Bags',
              category_id: 'invalid',
              advertised_start: { seconds: currentDateInSeconds + 5 },
            },
            '2': {
              race_id: '2',
              race_number: 5,
              meeting_name: 'Finger Lakes',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 6 },
            },
            '3': {
              race_id: '3',
              race_number: 6,
              meeting_name: 'Hereford',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 3 },
            },
          },
        },
      }

      const sortedList = constructSortedListOfRaces(raceResponse, currentDate)
      expect(sortedList.length).toBe(2)
      expect(sortedList[0].meeting_name).toBe('Hereford')
      expect(sortedList[1].meeting_name).toBe('Finger Lakes')
    })

    it('should exclude invalid start times', () => {
      const currentDate = new Date()
      const currentDateInSeconds = Math.floor(currentDate.getTime() / 1000)

      const raceResponse = {
        status: 200,
        data: {
          race_summaries: {
            '1': {
              race_id: '1',
              race_number: 7,
              meeting_name: 'Swindon Bags',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds - 600 },
            },
            '2': {
              race_id: '2',
              race_number: 5,
              meeting_name: 'Finger Lakes',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 6 },
            },
            '3': {
              race_id: '3',
              race_number: 6,
              meeting_name: 'Hereford',
              category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
              advertised_start: { seconds: currentDateInSeconds + 3 },
            },
          },
        },
      }

      const sortedList = constructSortedListOfRaces(raceResponse, currentDate)
      expect(sortedList.length).toBe(2)
      expect(sortedList[0].meeting_name).toBe('Hereford')
      expect(sortedList[1].meeting_name).toBe('Finger Lakes')
    })
  })

  describe('Time String', () => {
    it('should show the correct time for positive seconds', () => {
      expect(timeString(122)).toBe('In 2 minutes, 2 seconds')
      expect(timeString(121)).toBe('In 2 minutes, 1 second')
      expect(timeString(120)).toBe('In 2 minutes, 0 seconds')

      expect(timeString(61)).toBe('In 1 minute, 1 second')
      expect(timeString(60)).toBe('In 1 minute, 0 seconds')

      expect(timeString(59)).toBe('In 59 seconds')
      expect(timeString(1)).toBe('In 1 second')
      expect(timeString(0)).toBe('In 0 seconds')
    })

    it('should show the correct time for negative seconds', () => {
      expect(timeString(-122)).toBe('122 seconds ago')
      expect(timeString(-1)).toBe('1 second ago')
    })
  })

  describe('Remove Invalid Entries', () => {
    it('should remove entries', () => {
      const currentDate = new Date()
      const currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000)
      const races: Race[] = [
        {
          race_id: '1',
          race_number: 1,
          meeting_name: 'mock 1',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds - 61 },
        },
        {
          race_id: '2',
          race_number: 2,
          meeting_name: 'mock 2',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds - 12 },
        },
        {
          race_id: '3',
          race_number: 3,
          meeting_name: 'mock 3',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds + 60 },
        },
      ]
      const onRemove = jest.fn()

      removeInvalidEntries(races, currentDate, onRemove)

      expect(onRemove).toHaveBeenCalledTimes(1)

      expect(races.length).toBe(2)
    })

    it('should not remove entries', () => {
      const currentDate = new Date()
      const currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000)
      const races: Race[] = [
        {
          race_id: '1',
          race_number: 1,
          meeting_name: 'mock 1',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds + 1 },
        },
        {
          race_id: '2',
          race_number: 2,
          meeting_name: 'mock 2',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds + 12 },
        },
        {
          race_id: '3',
          race_number: 3,
          meeting_name: 'mock 3',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds + 60 },
        },
      ]
      const onRemove = jest.fn()

      removeInvalidEntries(races, currentDate, onRemove)

      expect(onRemove).not.toHaveBeenCalled()

      expect(races.length).toBe(3)
    })

    it('should remove multiple entries', () => {
      const currentDate = new Date()
      const currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000)
      const races: Race[] = [
        {
          race_id: '1',
          race_number: 1,
          meeting_name: 'mock 1',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds - 60 },
        },
        {
          race_id: '2',
          race_number: 2,
          meeting_name: 'mock 2',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds - 60 },
        },
        {
          race_id: '3',
          race_number: 3,
          meeting_name: 'mock 3',
          category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
          advertised_start: { seconds: currentTimeInSeconds + 60 },
        },
      ]
      const onRemove = jest.fn()

      removeInvalidEntries(races, currentDate, onRemove)

      expect(onRemove).toHaveBeenCalledTimes(1)

      expect(races.length).toBe(1)
    })
  })
})
