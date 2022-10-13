import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { availableColors, capitalize } from '../filters/colors'
import { ReactComponent as TimesSolid } from './times-solid.svg'
import {
  todoColorSelected,
  todoDeleted,
  todoToggled,
  selectTodoById,
} from './todosSlice'
export default function TodoListItem({ id }) {
  // const todo = useSelector(state => state.todos.find(todo => todo.id === id));
  const todo = useSelector((state) => selectTodoById(state, id))
  const { text, completed, color } = todo
  const dispatch = useDispatch();
  const onDelete = e => dispatch(todoDeleted(todo.id))

  const handleColorChanged = e => {
    const color = e.target.value;
    dispatch(todoColorSelected(todo.id, color))
  }
  const handleCompletedChanged = e => dispatch(todoToggled(todo.id))


  return (
    <li style={{ display: 'flex'}}>
      <input type='checkbox' 
        checked={completed} 
        style={{ width: '5%' }}
        onChange={handleCompletedChanged}
      />
      <h3 style={{ width: '70%' }}>{text}</h3>
      <select onChange={handleColorChanged} 
        style={{ color, width: '20%' }}
        value={color}>
          <option key='default' value='default'></option>
          {
            availableColors.map(color => <option key={color} value={color}>{capitalize(color)}</option>)
          }
      </select>
      <button onClick={onDelete}
        style={{ width: '5%' }}>
        <TimesSolid/>
      </button>
      
    </li>
  );
}