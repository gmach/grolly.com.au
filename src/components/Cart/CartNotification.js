import { useSelector } from "react-redux"

export function CartNotification() {
  const cartChanged = useSelector(state => state.todos.cartChanged)
	const cartMessage = cartChanged ? 'Item has been added to your shopping cart' : 'Item already exists in your shopping cart!'	
  return (
    <>
      <div hidden className="cartPrompt notification-panel">
        <div className="notification-panel-body">
          <p>{ cartMessage }</p>
        </div>
     </div>
    </>
  )
}
