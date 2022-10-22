import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'
import { isAdmin } from '../../config'
import _ from 'lodash'
const cartItemsAdapter = createEntityAdapter()
export const initialState = cartItemsAdapter.getInitialState({
  cartChanged: false
}) // will autogenerate normalized state object { ids: [], entities: {} }

/* Autogenerate Reducer and action creators */
const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    // todoAdded(state, action) {
    //   const todo = action.payload
    //   state.entities[todo.id] = todo;
    //   state.status = 'idle'
    // },
    addToCart(state, action) {
      const item = action.payload
      let cart = state.cartItems.cart
      let startSize = state.cartItems.cart.length;
      item.datedAdded = new Date().toString().substr(0,21);
      cart.push(item);
      let newCart = _.uniqWith(cart, (val1, val2) => {
          return val1.id == val2.id && val1.stockCode == val2.stockCode;
      });
      state.cartChanged = newCart.length > startSize
      state.cart = newCart
    },
    // todoDeleted(state, action) {
    //   delete state.entities[action.payload]
    // }
    removeFromCart: cartItemsAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
   
    // cartItemsLoading(state, action) {
    //   state.status = 'loading'
    // },
    // cartItemsLoaded(state, action) {
    //   const newEntities = {}
    //   action.payload.forEach((todo) => {
    //     newEntities[todo.id] = todo
    //   })
    //   state.entities = newEntities
    //   state.status = 'idle'
    // },
    // cartItemsSaving(state, action) {
    //   state.status = 'saving'
    // }
  },
  
})  

export const {
  setCategoryId,
  addToCart,
  todoColorSelected,
  todoDeleted,
  allCompleted,
  completedCleared,
} = cartItemsSlice.actions

export default cartItemsSlice.reducer

export const {
  selectAll: selectProducts,
  selectById: selectProductById,
} = cartItemsAdapter.getSelectors((state) => state.cartItems)

/* Selectors */
export const selectTodoIds = createSelector(
  selectProducts,
  cartItems => cartItems.map(todo => todo.id)
)

export const selectFilteredcartItems = createSelector(
  selectProducts,
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

export const selectFilteredTodoIds = createSelector(
  selectFilteredcartItems,
  cartItems => cartItems.map(todo => todo.id)
)
