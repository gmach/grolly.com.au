import {
  createSlice,
  createSelector,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'
import _ from 'lodash'
const cartItemsAdapter = createEntityAdapter()
export const initialState = cartItemsAdapter.getInitialState() // will autogenerate normalized state object { ids: [], entities: {} }

/* Autogenerate Reducer and action creators */
const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    addToCart: cartItemsAdapter.addOne,
    removeFromCart: cartItemsAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
  },
  
})  

export const {
  addToCart,
  removeFromCart
} = cartItemsSlice.actions

export default cartItemsSlice.reducer

export const {
  selectAll: selectCartItems,
  selectById: selectCartItemById,
} = cartItemsAdapter.getSelectors((state) => state.cartItems)

export const selectFilteredcartItems = createSelector(
  selectCartItems,
  state => state.filters,
  (cartItems, filters) => {
    const {status, colors} = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return cartItems
    }
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed cartItems based on filter
    return cartItems.filter(todo => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)
