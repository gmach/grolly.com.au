import React from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "react-router-dom";

export const SpinnerLoader = React.memo(() => {
  const status = useSelector(state => state.products.status)
  const navigation = useNavigation();

const isSearching = (navigation.state === "loading" &&
                        navigation.location &&
                        new URLSearchParams(navigation.location.search).has("q"))
  return (status === 'loading' || isSearching) ? 
    <>
      <div className="spinner-wrapper">
        <div className="loadingio-spinner-spinner-ev6jh5v9rqq"><div className="ldio-5h29m0fq6k6">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div></div>
      </div>
    </>
    : null
})
