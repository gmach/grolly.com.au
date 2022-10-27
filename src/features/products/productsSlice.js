import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { isAdmin, ApiUrl } from '../../config'

const productsAdapter = createEntityAdapter()
export const initialState = productsAdapter.getInitialState({
  status: 'idle', //represents ANY async call status
  categoryId: '',
  totalCount: 0,
  page: 0
}) // will autogenerate normalized state object { ids: [], entities: {} }

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (page = 1, {dispatch, getState}) => {
  const categoryId = getState().products.categoryId
  const filter = getState().filters.filter
  const url = ApiUrl + '/category/' + categoryId
  + '/filter/' + filter
  + '/page/' + page
  + '/isAdmin/' + isAdmin;
  let response = await fetch(url)
  response = await response.json()
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
  const records = response.records
  records.sort(productSort)
  records.forEach((record) => {
    record.categoryId = categoryId
  })
  for (let item of records) {
    if (item.children) {
      for (let c of item.children) {
        if (c.coles)
          item.coles = c.coles
      }
    }
  }
  return {
    page,
    records,
    totalCount: response.totalCount
  }
})

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId, {dispatch, getState}) => {
  const url = ApiUrl + '/product/' + productId
  + '/' + isAdmin;
  let response = await fetch(url)
  response = await response.json()
  return response
})

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
        const { page, records, totalCount } = action.payload
        productsAdapter.upsertMany(state, records)
        state.page = page
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
  setCategoryId
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

export const selectCategoryProducts = createSelector(
  selectProducts,
  state => state.products.categoryId,
  (products, categoryId) => {
    return products.filter(product => {
      let res =  product.categoryId === categoryId
      return res
    })
  }
)

export const selectFilteredCategoryProducts = createSelector(
  selectCategoryProducts,
  state => state.filters,
  (products, filters) => {
    return products.filter(product => {
      let res =  filters.filter === 'all' || product.type === filters.filter
      return res
    })
  }
)
  
