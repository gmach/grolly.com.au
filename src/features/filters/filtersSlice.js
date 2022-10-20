export const StatusFilters = {
  All: 'all',
  Both: 'both',
  Woolworths: 'woolworths',
  Coles: 'coles'
}

export const initialState = {
  filter: StatusFilters.All
}

/* Reducer */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        filter: action.payload,
      }
    }
    default:
      return state
  }
}

/* Action Creators */
export const statusFilterChanged = (filter) => ({
  type: 'filters/statusFilterChanged',
  payload: filter,
})
