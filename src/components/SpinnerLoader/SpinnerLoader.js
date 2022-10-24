import { useSelector } from "react-redux";

export const SpinnerLoader = () => {
  const status = useSelector(state => state.products.status)
  return status === 'loading' ? 
    <>
      <div className="spinner-wrapper">
        <div className="loadingio-spinner-spinner-ev6jh5v9rqq"><div className="ldio-5h29m0fq6k6">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div></div>
      </div>
    </>
    : null
}
