import { render, screen } from '@testing-library/react'
import { Race } from '../types/types'
import RaceView from './RaceView'

describe('Race View', () => {
  const currentTime = new Date()
  const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000)
  const race: Race = {
    race_id: '1',
    race_number: 1,
    meeting_name: 'mock meeting name',
    category_id: '123',
    advertised_start: {
      seconds: currentTimeInSeconds + 59,
    },
  }

  it('should render correctly', () => {
    render(<RaceView race={race} time={currentTime} />)

    expect(screen.getByText('mock meeting name - 1')).toBeDefined()
    expect(screen.getByText('In 59 seconds')).toBeDefined()
  })
})
