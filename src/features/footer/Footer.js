import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { availableColors, capitalize } from "../filters/colors"
import { selectTodos } from "../todos/todosSlice";
import { StatusFilters, colorFilterChanged } from "../filters/filtersSlice";
export default function Footer() {
  const dispatch = useDispatch()
  const { status, colors } = useSelector(state => state.filters)

  function Actions() {
    const markAllCompleted = () => dispatch({ type: 'todos/allCompleted' })
    const clearCompleted = () => dispatch({ type: 'todos/completedCleared' })
    return (
      <section>
        <h3>Actions</h3>
        <button onClick={markAllCompleted}>Mark All Completed</button>
        <button onClick={clearCompleted}>Clear Completed</button>
      </section>
    )
  }

  function RemainingTodos() {
    // const remainingTodosCount = useSelector(state => (state.todos.filter(todo => !todo.completed)).length)
    const remainingTodosCount = useSelector(state => selectTodos(state).filter(todo => !todo.completed).length)
    return (
      <section>
        <h3>RemainingTodos</h3>
        <h5>{remainingTodosCount} items left</h5>
      </section>
    
    )
  }

  function FilterByStatus() {
    return (
      <section>
        <h3>FilterByStatus</h3>
        <ul>
          {
            Object.keys(StatusFilters).map(key => {
              const value = StatusFilters[key]
              const handleFilterStatus = () => dispatch({
                type: 'filters/statusFilterChanged',
                payload: value
              })
              const isSelected = status === value
              return (
                <li key={value}>
                  <button 
                    onClick={handleFilterStatus} 
                    style={{
                      width: 100,
                      borderRadius: 10,
                      backgroundColor : isSelected ? 'green' : 'white'
                    }}
                  >
                    {key}
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>

    )
  }

  function FilterByColor() {
    return (
      <section>
        <h3>FilterByColor</h3>
        <div className="container">
          {
            availableColors.map(color => {
              const checked = colors.includes(color)
              const changeType = checked ? 'removed' : 'added'
              // const handleColorsStatus = () => dispatch({
              //   type: 'filters/colorFilterChanged',
              //   payload: {
              //     color, 
              //     changeType
              //   }
              // })
              const handleColorsStatus = () => dispatch(colorFilterChanged(color, changeType))

              return (
                <div key={color}>
                  <input 
                    type='checkbox' checked={checked}
                    onChange={handleColorsStatus}
                  />
                  <span 
                    style={{
                      display: 'inline-block',
                      width: 20,
                      height: 10,
                      backgroundColor: color
                    }}
                  />
                  <span>{capitalize(color)}</span>
                </div>
              )
            })
          }
        </div>
      </section>
      
    )
  }
  // This version of Footer relies on nested Actions, RemainingTodos, FilterByStatus and FilterByColor having
  // access to the dispatch from Footer. 
  // If you make them separate components in separate files its better to lift the dispatch handling
  // to inside the Footer like in Footer2.js and pass props down 
  return (
    <footer>
      <Actions/>
      <RemainingTodos/>
      <FilterByStatus/> 
      <FilterByColor/>
    </footer>
  )

}