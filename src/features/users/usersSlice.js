export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

export const initialState = {
  status: StatusFilters.All,
  colors: [],
}

/* Reducer */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        status: action.payload,
      }
    }
    case 'filters/colorFilterChanged': {
      let { color, changeType } = action.payload
      const { colors } = state

      switch (changeType) {
        case 'added': {
          if (colors.includes(color)) {
            // This color already is set as a filter. Don't change the state.
            return state
          }

          return {
            ...state,
            colors: state.colors.concat(color),
          }
        }
        case 'removed': {
          return {
            ...state,
            colors: state.colors.filter(
              (existingColor) => existingColor !== color
            ),
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

/* Action Creators */
export const statusFilterChanged = (status) => ({
  type: 'filters/statusFilterChanged',
  payload: status,
})

export const colorFilterChanged = (color, changeType) => ({
    type: 'filters/colorFilterChanged',
    payload: { color, changeType },
})
