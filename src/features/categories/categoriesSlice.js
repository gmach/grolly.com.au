import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

const categoriesAdapter = createEntityAdapter()
export const initialState = todosAdapter.getInitialState({
  status: 'idle', //represents ANY async call status
  showCategories: false,
  categoryName: 'BOOYAH'
}) // will autogenerate normalized state object { ids: [], entities: {} }


const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
const page = 1;
const filter = 'all'
const isAdmin = false; // admin view
const url = RESTURL + '/category/' + 1
+ '/filter/' + filter
+ '/page/' + page
+ '/isAdmin/' + isAdmin;


// Autogenerate thunk action creators and types for managing loading async call status (pending ie loading/saving in progress, fulfilled ie success, rejected ie error)
// In dispatching these thunks it will auto dispatch the pending action->make async call->dispatch fulfilled/rejected action
// If you need to handle any action in reducer then put in extraReducers in createSlice
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  let response = await window.fetch(url)
  response = await response.json()
  return response.records
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text, {dispatch}) => {
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
    toggleShowCategories(state) {
      state.showCategories = !state.showCategories
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
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      .addCase(saveNewTodo.pending, (state, action) => {
        state.status = 'saving'
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
  toggleShowCategories,
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