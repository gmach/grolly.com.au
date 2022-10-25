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
  return {
    categoryId,
    totalCount: response.totalCount,
    records: response.records
  }
})

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId, {dispatch, getState}) => {
  const RESTURL = 'http://localhost:1234';
  const url = RESTURL + '/product/' + productId
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
    setCategoryId(state, action) {
      state.categoryId = action.payload
    }
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        let { categoryId, totalCount, records } = action.payload
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
        records.forEach((record) => {
          record.categoryId = categoryId
        });
        productsAdapter.upsertMany(state, records)
        state.totalCount = totalCount
        state.categoryId = categoryId
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

export const selectFilteredProducts = createSelector(
  selectProducts,
  state => state.filters,
  (products, filters) => {
    return products.filter(product => {
      let res =  filters.filter === 'all' || product.type === filters.filter
      return res
    })
})

export const selectFilteredCategoryProducts = createSelector(
  selectFilteredProducts,
  state => state.products.categoryId,
  (products, categoryId ) => {
    return products.filter(product => {
      let res = product.categoryId === categoryId
      return res
    })
  })  

