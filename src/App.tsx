import React, { useEffect, useRef } from 'react'
import './App.css'
import { getRaces } from './api/api'
import RaceView from './components/RaceView'
import { constructSortedListOfRaces, isValidTime } from './helpers/helpers'
import { CategoriesMap, CategoryType, Race, RacesResponse } from './types/types'

type CheckboxProps = {
  [K in CategoryType]: boolean
}
function App() {
  const [displayArray, setDisplayArray] = React.useState<Race[]>([])
  const [time, setTime] = React.useState<Date>(new Date())
  const [checkboxValues, setCheckboxValues] = React.useState<CheckboxProps>({
    'Greyhound Racing': true,
    'Harness Racing': true,
    'Horse Racing': true,
  })
  const initialised = useRef(false)

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true
      getdata()
    }

    const interval = setInterval(() => {
      setTime(new Date())
    })

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    removeInvalidEntries()
  }, [time])

  const getdata = async () => {
    const body: RacesResponse = await getRaces()

    const sortedRaces = constructSortedListOfRaces(body, time)

    setDisplayArray(sortedRaces)
  }

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value as CategoryType
    const oldValue: boolean = checkboxValues[name]
    setCheckboxValues({ ...checkboxValues, [name]: !oldValue })
  }

  const showCategoryFilter = (race: Race): boolean => {
    return checkboxValues[CategoriesMap[race.category_id]]
  }

  const removeInvalidEntries = () => {
    if (displayArray.length === 0) return
    let counter = 0

    while (!isValidTime(displayArray[0].advertised_start.seconds, time)) {
      displayArray.shift()
      counter++
    }
    if (counter !== 0) {
      setDisplayArray([...displayArray])
      getdata()
    }
  }

  return (
    <>
      <h1>Next races</h1>
      {Object.values(CategoriesMap).map((value) => (
        <div key={value}>
          <input
            type='checkbox'
            value={value}
            checked={checkboxValues[value]}
            onChange={checkboxHandler}
          />
          <label>{value}</label>
        </div>
      ))}
      {displayArray.length === 0 && <div>Loading...</div>}
      {displayArray
        .filter((race) => showCategoryFilter(race))
        .slice(0, 5)
        .map((e) => (
          <RaceView race={e} time={time} key={e.race_id} />
        ))}
      <button onClick={() => getdata()}>Manually Refresh</button>
    </>
  )
}

export default App
