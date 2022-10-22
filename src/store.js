import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './features/products/productsSlice'
import filtersReducer from './features/filters/filtersSlice'
import cartItemsReducer from './features/cart/cartSlice'

const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer,
    cartItems: cartItemsReducer
  }
})

export default store;