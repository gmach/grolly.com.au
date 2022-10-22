import { useContext } from "react"
import { RootContext } from "../Root"

export function CartNotification() {
  const { data } = useContext(RootContext);
  const cartChanged = data.cartChanged
	const cartMessage = cartChanged ? 'Item has been added to your shopping cart' : 'Item already exists in your shopping cart!'	
  const showCartMsg = data.showCartMsg
  return (
    <>
      {
        showCartMsg && 
        <div className="cartPrompt notification-panel">
          <div className="notification-panel-body">
            <p>{ cartMessage }</p>
          </div>
     </div>        
      }
    </>
  )
}
