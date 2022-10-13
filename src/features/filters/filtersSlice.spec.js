import filtersReducer, { initialState, StatusFilters, statusFilterChanged, colorFilterChanged } from './filtersSlice'

test('Status filter changed', () => {
  const action = statusFilterChanged(StatusFilters.Active)
  expect(initialState.status).toBe(StatusFilters.All)
  const result = filtersReducer(initialState, action)
  expect(result.status).toBe(StatusFilters.Active)
})

test('Color filter add blue color', () => {
  const action = colorFilterChanged('blue','added')
  expect(initialState.colors.length).toBe(0)
  const result = filtersReducer(initialState, action)
  expect(result.colors.length).toBe(1)
  expect(result.colors[0]).toBe('blue')
})

test('Color filter remove red color', () => {
  const action = colorFilterChanged('red','removed')
  const result = filtersReducer({ colors: ['red', 'blue', 'white']}, action)
  expect(result.colors.length).toBe(2)
  expect(result.colors[0]).toBe('blue')
  expect(result.colors[1]).toBe('white')
})


