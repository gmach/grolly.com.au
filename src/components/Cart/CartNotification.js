import { useContext } from "react"
import { RootContext } from "../Root"

export function CartNotification() {
  const { state } = useContext(RootContext);
  return (
    <>
      {
        state && state.cartMessage && 
        <div className="cartPrompt notification-panel">
          <div className="notification-panel-body">
            <p>{ state.cartMessage }</p>
          </div>
     </div>        
      }
    </>
  )
}
