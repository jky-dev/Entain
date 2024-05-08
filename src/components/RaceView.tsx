import { timeString } from '../helpers/helpers'
import { Race } from '../types/types'

interface RaceViewProps {
  race: Race
  time: Date
}

const RaceView: React.FC<RaceViewProps> = ({ race, time }) => {
  const displaySeconds = Math.floor(
    (race.advertised_start.seconds * 1000 - time.getTime()) / 1000
  )

  return (
    <div>
      {race.meeting_name} - {race.race_number} - {timeString(displaySeconds)}
    </div>
  )
}

export default RaceView
