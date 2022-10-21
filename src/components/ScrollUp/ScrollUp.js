import useScroll from '../../hooks/useScroll'

export default function ScrollUp() {
  const [scrollTo] = useScroll()
  const scrollUp = () => {
    scrollTo(0, 0)
  }
  
  return (
    <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      
  )
}
