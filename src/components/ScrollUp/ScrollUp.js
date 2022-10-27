import useScroll from '../../hooks/useScroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

export default function ScrollUp() {
  const [scrollTo] = useScroll()
  const scrollUp = () => {
    scrollTo(0, 0)
  }
  
  return (
    <span className="scrollup" onClick={scrollUp}>
      <FontAwesomeIcon icon={faChevronCircleUp} />
    </span>      
  )
}
