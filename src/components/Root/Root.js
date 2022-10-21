import { Outlet } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SpinnerLoader from '../SpinnerLoader'

export const Root = () => {
  return (
    <>
      <Header/>
      <SpinnerLoader/>
      <Outlet/>
      <Footer/>
    </>
  );
}
