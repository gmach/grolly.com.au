import { useState, useCallback } from 'react'

export default  function useToggle ( initialValue = false) {
  const [state, setState] = useState(initialValue)

  const setToggle = useCallback( () => setState(state => !state), [])

  return [state, setToggle]

}