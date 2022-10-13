import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveNewTodo } from '../todos/todosSlice'

export default function Header() {
  const [text, setText] = useState('')
  // const [status, setStatus] = useState('idle');
  const status = useSelector(state => state.todos.status)
  const dispatch = useDispatch();

  const handleChange = e => setText(e.target.value);

  const handleKeyDown = async e => {
    const key = e.key;
    if (key === 'Enter') {
      const trimmedText = text.trim()
      // setStatus('saving')
      // Create the thunk function and immediately dispatch it
      await dispatch(saveNewTodo(trimmedText))
      // dispatch({
      //   type: 'todos/todoAdded',
      //   payload: trimmedText
      // })
      setText('')
      // setStatus('idle')
    }
  };

  const isSaving = status === 'saving'
  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
      />
      { isSaving ? <h1>Saving Todo ...</h1> : null }
    </header>
  )
}