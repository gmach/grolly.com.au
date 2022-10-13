import reducer, { 
  initialState,
  todoToggled,
  todoColorSelected,
  todoDeleted,
  allCompleted,
  completedCleared,
  selectTodos
}   from './todosSlice'

function nextTodoId() {
  const todos = selectTodos(initialState);
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

test('Add new todo', () => {
  const action = todoAdded({
    id: nextTodoId(),
    text: 'yo mama',
    completed: false,
  })
  expect(initialState.entities.length).toBe(3)
  const result = todosReducer(initialState, action)
  expect(result.entities.length).toBe(4)
  expect(result.entities[3]).toBe(action.payload)
})

test('Toggles a todo based on id', () => {
  const action = todoToggled(0)
  expect(initialState.entities[0].completed).toBe(true)
  const result = todosReducer(initialState, action)
  expect(result.entities[0].completed).toBe(false)
})

test('Select color on todo', () => {
  const action = todoColorSelected(1, 'red')
  expect(initialState.entities[1].color).toBe('purple')
  const result = todosReducer(initialState, action)
  expect(result.entities[1].color).toBe('red')
})

test('Delete todo', () => {
  const action = todoDeleted(2)
  expect(initialState.entities.length).toBe(3)
  const result = todosReducer(initialState, action)
  expect(result.entities.length).toBe(2)
})

test('Mark all completed todos', () => {
  const action = allTodosCompleted()
  expect(initialState.entities[0].completed).toBe(true)
  expect(initialState.entities[1].completed).toBe(false)
  expect(initialState.entities[2].completed).toBe(false)
  const result = todosReducer(initialState, action)
  expect(result.entities[0].completed).toBe(true)
  expect(result.entities[1].completed).toBe(true)
  expect(result.entities[2].completed).toBe(true)
})

test('Clear completed todos', () => {
  const action = completedTodosCleared()
  expect(initialState.entities.length).toBe(3)
  expect(initialState.entities[0].completed).toBe(true)
  expect(initialState.entities[1].completed).toBe(false)
  expect(initialState.entities[2].completed).toBe(false)
  const result = todosReducer(initialState, action)
  expect(result.entities.length).toBe(2)
})

test('todosLoading', () => {
  const action = todosLoading()
  expect(initialState.status).toBe('idle')
  const result = todosReducer(initialState, action)
  expect(result.status).toBe('loading')
})

test('todosSaving', () => {
  const action = todosSaving()
  expect(initialState.savingStatus).toBe('idle')
  const result = todosReducer(initialState, action)
  expect(result.savingStatus).toBe('saving')
})

test('todosLoaded', () => {
  const responseData = [
    { id: 1, text: 'fox jumped over', completed: false, color: 'pink' },
    { id: 2, text: 'the lazy dogs!', completed: false, color: 'orange' }
  ]
  expect(initialState.entities.length).toBe(3)
  const action = todosLoaded(responseData)
  const result = todosReducer(initialState, action)
  expect(result.entities.length).toBe(2)
  expect(result.entities).toBe(responseData)
  expect(result.status).toBe('idle')
})
