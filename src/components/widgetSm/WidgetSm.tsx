import './widgetSm.scss'

const WidgetSm = () => {
  return (
    <div className='widgetSmComponent'>
      <span className='title'>Últimos productos agregados</span>
      <ul>
        <li>
          <div>
            <span className='product'>producto</span>
            <span className='category'>categoria</span>
          </div>
        </li>
        <li>
          <div>
            <span className='product'>producto</span>
            <span className='category'>categoria</span>
          </div>
        </li>
        <li>
          <div>
            <span className='product'>producto</span>
            <span className='category'>categoria</span>
          </div>
        </li>
        <li>
          <div>
            <p className='product'>producto</p>
            <p className='category'>categoria</p>
          </div>
        </li>
        <li>
          <div>
            <span className='product'>producto</span>
            <span className='category'>categoria</span>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default WidgetSm