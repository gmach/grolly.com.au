import { useEffect } from "react";

export default function InfiniteScroll({ getNewData, children }) {
  
  useEffect(() => {
    const scrollHandler = () => {  
      const isAtBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop <= document.documentElement.clientHeight
      // const isAtBottom = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      if (isAtBottom) 
        getNewData()
    }
    document.addEventListener("scroll", scrollHandler)  //window.onscroll = scrollHandler
    return () => document.removeEventListener("scroll", scrollHandler)
  }, [])

  return (
    <>
    {children}
    </> 
  ) 
} 
