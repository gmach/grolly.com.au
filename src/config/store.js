import { configureStore } from '@reduxjs/toolkit'

import productsReducer from '../features/products/productsSlice'
import filtersReducer from '../features/filters/filtersSlice'
import cartItemsReducer from '../features/cart/cartSlice'

const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    cartItems: cartItemsReducer
  }
})

export default store;