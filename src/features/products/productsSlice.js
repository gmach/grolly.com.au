import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'
import { isAdmin } from '../../config'

const productsAdapter = createEntityAdapter()
export const initialState = productsAdapter.getInitialState({
  status: 'idle', //represents ANY async call status
  categoryId: '',
  totalCount: 0
}) // will autogenerate normalized state object { ids: [], entities: {} }

// Autogenerate thunk action creators and types for managing loading async call status (pending ie loading/saving in progress, fulfilled ie success, rejected ie error)
// In dispatching these thunks it will auto dispatch the pending action->make async call->dispatch fulfilled/rejected action
// If you need to handle any action in reducer then put in extraReducers in createSlice

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (categoryId, {dispatch, getState}) => {
  const RESTURL = 'http://localhost:1234';
  const filter = getState().filters.filter;
  const page = 1;
  const url = RESTURL + '/category/' + categoryId
  + '/filter/' + filter
  + '/page/' + page
  + '/isAdmin/' + isAdmin;
  let response = await window.fetch(url)
  response = await response.json()
  return response
})

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (id, {dispatch, getState}) => {
  const RESTURL = 'http://localhost:1234';
  const url = RESTURL + '/product/' + id
  + '/' + isAdmin;
  let response = await window.fetch(url)
  response = await response.json()
  return response
})

// export const saveNewProduct = createAsyncThunk('products/saveNewProduct', async (product, {dispatch, getState}) => {

/* Autogenerate Reducer and action creators */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // productsAdded(state, action) {
    //   const products = action.payload
    //   state.entities[products.id] = products;
    //   state.status = 'idle'
    // },
    setCategoryId(state, action) {
      state.categoryId = action.payload
    },
    // productsDeleted(state, action) {
    //   delete state.entities[action.payload]
    // }
    productsDeleted: productsAdapter.removeOne,
    completedCleared(state, action) {
      // Object.values(state.entities).forEach(products => {
      //   if (products.completed)
      //     delete state.entities[products.id]
      // })
      const completedIds = Object.values(state.entities)
        .filter((products) => products.completed)
        .map((products) => products.id)
      productsAdapter.removeMany(state, completedIds)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        let { records, totalCount } = action.payload
        const productSort = (a, b) => {
          let percent_a = a.diffPercent?a.diffPercent:0;
          let percent_b = b.diffPercent?b.diffPercent:0;
          if (a.type != 'both')
              percent_a = a.discountPercent?a.discountPercent:0;
          if (b.type != 'both')
              percent_b = b.discountPercent?b.discountPercent:0;
          if (Number(percent_a) < Number(percent_b)) return 1;
          if (Number(percent_a) > Number(percent_b)) return -1;
          return 0;
        }
        records = records.sort(productSort)
        productsAdapter.setAll(state, records)
        state.totalCount = totalCount
        state.status = 'idle'
      })
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload)
        state.status = 'idle'
      })
  }
})  

export const {
  setCategoryId,
  productsDeleted,
  completedCleared,
} = productsSlice.actions

export default productsSlice.reducer

export const {
  selectAll: selectProducts,
  selectById: selectProductById,
} = productsAdapter.getSelectors((state) => state.products)

/* Selectors */
export const selectProductIds = createSelector(
  selectProducts,
  products => products.map(products => products.id)
)

export const selectFilteredproducts = createSelector(
  selectProducts,
  state => state.filters,
  (products, filters) => {
    const {status, colors} = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return products
    }
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed products based on filter
    return products.filter(products => {
      const statusMatches =
        showAllCompletions || products.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(products.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredProductIds = createSelector(
  selectFilteredproducts,
  products => products.map(products => products.id)
)
