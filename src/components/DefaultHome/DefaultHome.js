import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryId } from '../../features/products/productsSlice';
import './styles.scss'
export const DefaultHome = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setCategoryId(''))
  }, []);

  return (
    <>
      <div className="homepage">
        {/* <img src={logoImage} alt="Logo Background"/> */}
      </div>
    </>
  )
}

