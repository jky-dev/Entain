import React, { useEffect } from 'react'
import './App.css'
import { getRaces } from './api/api'
import RaceView from './components/RaceView'
import { constructSortedListOfRaces, isValidTime } from './helpers/helpers'
import { Race, RacesResponse, categories } from './types/types'

function App() {
  const [displayArray, setDisplayArray] = React.useState<Race[]>([])
  const [time, setTime] = React.useState<Date>(new Date())
  const [checkboxValues, setCheckboxValues] = React.useState({
    'Greyhound Racing': true,
    'Harness Racing': true,
    'Horse Racing': true,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
      removeInvalidEntries()
    }, 1000)

    getdata()

    return () => clearInterval(interval)
  }, [])

  const getdata = async () => {
    console.log('getting data')
    const body: RacesResponse = await getRaces()

    const sortedRaces = constructSortedListOfRaces(body, time)

    console.log('old', displayArray, 'new', sortedRaces)
    setDisplayArray(sortedRaces)
  }

  const checkboxHandler = (e) => {
    const name = e.target.value
    const oldValue: boolean = checkboxValues[e.target.value]
    setCheckboxValues({ ...checkboxValues, [name]: !oldValue })
  }

  const showCategoryFilter = (race: Race): boolean => {
    return checkboxValues[categories[race.category_id]]
  }

  const removeInvalidEntries = () => {
    console.log('checking')
    if (displayArray.length === 0) return
    const counter = 0
    while (!isValidTime(displayArray[0].advertised_start.seconds, time)) {
      const race = displayArray.shift()
      console.log('removing top', race?.meeting_name, race?.race_number)
    }
    if (counter !== 0) {
      getdata()
    }
  }

  return (
    <>
      <h1>Next races</h1>
      <div>
        <input
          type='checkbox'
          value='Greyhound Racing'
          checked={checkboxValues['Greyhound Racing']}
          onChange={checkboxHandler}
        />
        <label>Greyhound Racing</label>
      </div>
      <div>
        <input
          type='checkbox'
          value='Harness Racing'
          checked={checkboxValues['Harness Racing']}
          onChange={checkboxHandler}
        />
        <label>Harness Racing</label>
      </div>
      <div>
        <input
          type='checkbox'
          value='Horse Racing'
          checked={checkboxValues['Horse Racing']}
          onChange={checkboxHandler}
        />
        <label>Horse Racing</label>
      </div>
      {displayArray
        .filter((race) => showCategoryFilter(race))
        .slice(0, 5)
        .map((e) => (
          <RaceView race={e} time={time} key={e.race_id} />
        ))}
      <button onClick={() => getdata()}></button>
    </>
  )
}

export default App
