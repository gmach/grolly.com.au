import "./SnackBar.scss"
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

  const cssStyles = { 
    backgroundColor : props.type === SnackBarType.success ? '#178841' : '#e01a22',
    color : props.type === SnackBarType.success ? 'black' : 'white'
  }
  return (
    <div className="snackbar" 
      id={ showSnackBar ? "show" : "hide" }
      style={cssStyles}
    >
      <div className="symbol">
        { props.type === SnackBarType.success ? <h1>&#x2713;</h1> : <h1>&#x2715;</h1> }
      </div>
      <div className="message">{ props.message }</div>
    </div>
  )
})
export default SnackBar