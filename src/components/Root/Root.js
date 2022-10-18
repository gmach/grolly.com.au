import { Outlet } from "react-router-dom";
import Header from '../Header'
import CategoryHeader from '../CategoryHeader'
import Footer from '../Footer'

export const Root = () => {
  return (
    <>
      <Header/>
      <CategoryHeader/>
      <Outlet/>
      <Footer/>
    </>
  );
}
