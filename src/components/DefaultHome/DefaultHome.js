import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryId } from '../../features/products/productsSlice';
import CategoryHeader from '../CategoryHeader'

export const DefaultHome = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setCategoryId(''))
  }, []);

  return (
    <>
    <CategoryHeader/>
    <main className="main-container">
      <div className="homepage text-center">
        <img className="img-fluid" src="/img/GroceryHawker-03.png" alt="df"/>
      </div>
    </main>  
    </>
  )
}

