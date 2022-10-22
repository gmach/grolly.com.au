import { useContext } from "react"
import { RootContext } from "../Root"

export function CartNotification() {
  const { data } = useContext(RootContext);
  return (
    <>
      {
        data && data.cartMessage && 
        <div className="cartPrompt notification-panel">
          <div className="notification-panel-body">
            <p>{ data.cartMessage }</p>
          </div>
     </div>        
      }
    </>
  )
}
