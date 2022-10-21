export default function useScroll () {

  const scrollTo = (x, y) => {
    window.scrollTo(x, y);
  }
  
  return [scrollTo];
}

