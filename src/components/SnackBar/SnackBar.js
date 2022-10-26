import "./SnackBar.css"
import { useState, forwardRef, useImperativeHandle } from "react"
export const SnackBarType = {
  success: 'Success',
  fail: 'Fail'
}

const SnackBar = forwardRef((props, ref) => {
  const [showSnackBar, setShowSnackBar] = useState(false)  

  useImperativeHandle(ref, () => ({
    show() {  
      setShowSnackBar(true)
      setTimeout(() => setShowSnackBar(false), 3000)
    }
  }))
  
  return (
    <div className="snackbar" 
      id={ showSnackBar ? "show" : "hide" }
      style={{ 
        backgroundColor : props.type === SnackBarType.success ? '#00F593' : '#FF0033',
        color : props.type === SnackBarType.success ? 'black' : 'white'
      }}
    >
      <div className="symbol">
        { props.type === SnackBarType.success ? <h1>&#x2713;</h1> : <h1>&#x2715;</h1> }
      </div>
      <div className="message">{ props.message }</div>
    </div>
  )
})
export default SnackBar