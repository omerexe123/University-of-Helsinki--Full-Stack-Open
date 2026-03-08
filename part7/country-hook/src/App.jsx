import { useState } from 'react'
import { useField, useCountry } from './hooks'

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  const { data } = country

  return (
    <div>
      <h3>{data.name.common}</h3>
      <div>capital {data.capital?.[0]}</div>
      <div>population {data.population}</div>
      <img src={data.flags.png} alt={data.flags.alt || 'flag'} height="100" />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  const omitReset = ({ reset, ...rest }) => rest

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...omitReset(nameInput)} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
