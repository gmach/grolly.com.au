import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "react-router-dom";

export const SpinnerLoader = React.memo(() => {
  const status = useSelector(state => state.products.status)
  const navigation = useNavigation();
  const wrapRef = useRef()
  
  useEffect(() => {
    const scrollHandler = () => {  
      if (document.getElementById("spinner-wrapper"))
        document.getElementById("spinner-wrapper").style.top = (document.documentElement.scrollTop + 200) + 'px'
        // wrapRef.current.style.top = (document.documentElement.scrollTop + 200) + 'px'
    }
    document.addEventListener("scroll", scrollHandler) //window.onscroll = scrollHandler
    return () => document.removeEventListener("scroll", scrollHandler)
  }, [])  
  
  const isSearching = (navigation.state === "loading" &&
                        navigation.location &&
                        new URLSearchParams(navigation.location.search).has("q"))

  return (status === 'loading' || isSearching) ? 
    <>
      <div className="spinner-wrapper" ref={wrapRef} id="spinner-wrapper">
        <div className="loadingio-spinner-spinner-ev6jh5v9rqq"><div className="ldio-5h29m0fq6k6">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div></div>
      </div>
    </>
    : null
})
