import React from "react";
import TodoListItem from "./TodoListItem";
import { useSelector } from "react-redux";
import { selectFilteredTodoIds } from "./todosSlice";
export default function TodoList() {
  // const todoListIds = useSelector(state => state.todos.map(todo => todo.id), shallowEqual);
  const todoListIds = useSelector(selectFilteredTodoIds)
  const status = useSelector(state => state.todos.status)
  
  if (status === 'loading')
    return (
      <h1 >LOADING ...</h1>
    )
  return (
    <ul>
      {
        todoListIds.map(todoId => <TodoListItem key={todoId} id={todoId}/>)
      }
    </ul>
    
  )
}