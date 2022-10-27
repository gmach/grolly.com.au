import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "react-router-dom";

export const SpinnerLoader = React.memo(() => {
  let status = useSelector(state => state.products.status)
  const navigation = useNavigation();
  const wrapRef = useRef()
  
  useEffect(() => {
    document.addEventListener("scroll", () => {  //window.onscroll = () => {  
      wrapRef.current.style.top = (document.documentElement.scrollTop + 200) + 'px'
    })
  }, [])  
  
  const isSearching = (navigation.state === "loading" &&
                        navigation.location &&
                        new URLSearchParams(navigation.location.search).has("q"))
                        status = 'loading'

  return (status === 'loading' || isSearching) ? 
    <>
      <div className="spinner-wrapper" ref={wrapRef}>
        <div className="loadingio-spinner-spinner-ev6jh5v9rqq"><div className="ldio-5h29m0fq6k6">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div></div>
      </div>
    </>
    : null
})
