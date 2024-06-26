import React, { useEffect, useRef } from 'react'
import { getRaces } from './api/api'
import RaceView from './components/RaceView'
import {
  constructSortedListOfRaces,
  removeInvalidEntries,
} from './helpers/helpers'
import { CategoriesMap, CategoryType, Race, RacesResponse } from './types/types'

import styles from './App.module.scss'

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
    removeInvalidEntries(displayArray, time, onRemove)
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

  const onRemove = () => {
    setDisplayArray([...displayArray])
    getdata()
  }

  return (
    <>
      <h1>Next races</h1>
      <div className={styles.checkboxContainer}>
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
      </div>
      {displayArray.length === 0 && <div>Loading...</div>}
      {displayArray
        .filter((race) => showCategoryFilter(race))
        .slice(0, 5)
        .map((e) => (
          <RaceView race={e} time={time} key={e.race_id} />
        ))}
    </>
  )
}

export default App
