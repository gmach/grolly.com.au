import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'
import { isAdmin } from '../../config'

const todosAdapter = createEntityAdapter()
export const initialState = todosAdapter.getInitialState({
  status: 'idle', //represents ANY async call status
  categoryId: '',
  totalCount: 0
}) // will autogenerate normalized state object { ids: [], entities: {} }

// Autogenerate thunk action creators and types for managing loading async call status (pending ie loading/saving in progress, fulfilled ie success, rejected ie error)
// In dispatching these thunks it will auto dispatch the pending action->make async call->dispatch fulfilled/rejected action
// If you need to handle any action in reducer then put in extraReducers in createSlice


const itemSort = (a, b) => {
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

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId, {dispatch, getState}) => {
  const RESTURL = 'http://localhost:1234';
  const url = RESTURL + '/product/' + productId
  + '/' + isAdmin;
  let response = await window.fetch(url)
  response = await response.json()
  return response
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text, {dispatch, getState}) => {
    const initialTodo = { text }
    const response = await fetch.post('/fakeApi/todos', { todo: initialTodo })
    return response.todo
  }
)
/* Autogenerate Reducer and action creators */
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // todoAdded(state, action) {
    //   const todo = action.payload
    //   state.entities[todo.id] = todo;
    //   state.status = 'idle'
    // },
    setCategoryId(state, action) {
      state.categoryId = action.payload
    },
    todoColorSelected: {
      prepare(todoId, color) {
        return {
          payload: {
            todoId,
            color
          }
        }
      },
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      }
    },
    // todoDeleted(state, action) {
    //   delete state.entities[action.payload]
    // }
    todoDeleted: todosAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
    completedCleared(state, action) {
      // Object.values(state.entities).forEach(todo => {
      //   if (todo.completed)
      //     delete state.entities[todo.id]
      // })
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo.completed)
        .map((todo) => todo.id)
      todosAdapter.removeMany(state, completedIds)
    },
    // todosLoading(state, action) {
    //   state.status = 'loading'
    // },
    // todosLoaded(state, action) {
    //   const newEntities = {}
    //   action.payload.forEach((todo) => {
    //     newEntities[todo.id] = todo
    //   })
    //   state.entities = newEntities
    //   state.status = 'idle'
    // },
    // todosSaving(state, action) {
    //   state.status = 'saving'
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        let { records, totalCount } = action.payload
        records = records.sort(itemSort)
        todosAdapter.setAll(state, records)
        state.totalCount = totalCount
        state.status = 'idle'
      })
      .addCase(saveNewTodo.pending, (state, action) => {
        state.status = 'saving'
      })
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        todosAdapter.addOne(state, action.payload)
        state.status = 'idle'
      })
      .addCase(saveNewTodo.fulfilled, (state, action) => {
        // todosAdapter.addOne()
        const todo = action.payload
        state.entities[todo.id] = todo
        state.ids = Object.keys(state.entities)
        state.status = 'idle'
      })
  }
})  

export const {
  setCategoryId,
  todoColorSelected,
  todoDeleted,
  allCompleted,
  completedCleared,
} = todosSlice.actions

export default todosSlice.reducer

export const {
  selectAll: selectProducts,
  selectById: selectProductById,
} = todosAdapter.getSelectors((state) => state.todos)

/* Selectors */
export const selectTodoIds = createSelector(
  selectProducts,
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  selectProducts,
  state => state.filters,
  (todos, filters) => {
    const {status, colors} = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  todos => todos.map(todo => todo.id)
)
