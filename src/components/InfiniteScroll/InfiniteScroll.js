import { useEffect } from "react";

export default function InfiniteScroll({ getNewData, children }) {
  
  useEffect(() => {
    window.onscroll = () => {   //window.addEventListener("scroll", () => {
      const isAtBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop <= document.documentElement.clientHeight
      // const isAtBottom = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      if (isAtBottom) {
        getNewData()
      }
    }
  }, [])

  return (
    <>
    {children}
    </> 
  ) 
} 
