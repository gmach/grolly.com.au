export const Error = ({errorMsg}) => {
  if (!errorMsg)
    return null;
  return (
    <div className="container">
        <h1>401 ERROR!</h1>
        <h3>Error : <span className=" alert-danger">{ errorMsg }</span></h3>
    </div>
  )
}
