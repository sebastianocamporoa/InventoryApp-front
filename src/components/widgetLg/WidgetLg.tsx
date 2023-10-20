import Button from './button/Button'
import './widgetLg.scss'

const WidgetLg = () => {
  return (
    <div className='widgetLgComponent'>
      <h3 className="title">Últimas ventas</h3>
      <table>
        <tr className='firstTr'>
          <th>Nombre del Producto</th>
          <th>Cantidad Vendida</th>
          <th>Fecha y Hora</th>
          <th>Estado</th>
        </tr>
        <tr className='secondTr'>
          <td className='user'>
            <span>Producto</span>
          </td>
          <td className='date'>20</td>
          <td className='amount'>19/10/2023</td>
          <td className='status'><Button type='Approved' /></td>
        </tr>
        <tr className='secondTr'>
          <td className='user'>
            <span>Producto</span>
          </td>
          <td className='date'>20</td>
          <td className='amount'>19/10/2023</td>
          <td className='status'><Button type='Declined' /></td>
        </tr>
        <tr className='secondTr'>
          <td className='user'>
            <span>Producto</span>
          </td>
          <td className='date'>20</td>
          <td className='amount'>19/10/2023</td>
          <td className='status'><Button type='Pending' /></td>
        </tr>
        <tr className='secondTr'>
          <td className='user'>
            <span>Producto</span>
          </td>
          <td className='date'>20</td>
          <td className='amount'>19/10/2023</td>
          <td className='status'><Button type='Approved' /></td>
        </tr>
      </table>
    </div>
  )
}

export default WidgetLg