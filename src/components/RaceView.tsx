import { timeString } from '../helpers/helpers'
import { Race } from '../types/types'
import styles from './RaceView.module.scss'
interface RaceViewProps {
  race: Race
  time: Date
}

const RaceView: React.FC<RaceViewProps> = ({ race, time }) => {
  const displaySeconds = Math.floor(
    (race.advertised_start.seconds * 1000 - time.getTime()) / 1000
  )

  return (
    <div className={styles.container}>
      <p>
        {race.meeting_name} - {race.race_number}
      </p>
      <p>{timeString(displaySeconds)}</p>
    </div>
  )
}

export default RaceView
