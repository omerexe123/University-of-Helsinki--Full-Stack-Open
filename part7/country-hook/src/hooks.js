import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  React.useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        const res = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/`)
        if (!res.ok) {
          setCountry({ found: false })
          return
        }
        const data = await res.json()
        setCountry({ found: true, data })
      } catch (e) {
        setCountry({ found: false })
      }
    }

    fetchCountry()
  }, [name])

  return country
}
