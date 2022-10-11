export const Error = () => {
  const errorMsg = 'Some error'
  return (
    <div className="container">
        <h1>401 ERROR!</h1>
        <h3>Error : <span className=" alert-danger">{ errorMsg }</span></h3>
    </div>

  )
}
