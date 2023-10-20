import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo'
import WidgetLg from '../../components/widgetLg/WidgetLg'
import WidgetSm from '../../components/widgetSm/WidgetSm'
import './home.scss'
import api from '../../api';
import { useEffect, useState } from 'react';

const Home = () => {
  const [lastProducts, setlastProducts] = useState(null)
  useEffect(() => {
    api.get('/products/recent')
   .then(response => {
       console.log(response.data);
   })
   .catch(error => {
       console.error("Hubo un error al obtener los productos:", error);
   });
  }, [])
  
  return (
    <div className='homePage'>
      <FeaturedInfo />
      <div className="widgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  )
}

export default Home