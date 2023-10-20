import { useEffect, useState } from "react";
import api from "../../api";
import "./widgetLg.scss";
import { Sale } from "../../interfaces";

const WidgetLg = () => {
  const [lastSales, setLastSales] = useState<Sale[]>([]);
  useEffect(() => {
    api
      .get("/purchase/lastSales")
      .then((response) => {
        setLastSales(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  }, []);
  return (
    <div className="widgetLgComponent">
      <h3 className="title">Últimas ventas</h3>
      <table>
        <thead>
          <tr className="firstTr">
            <th>ID</th>
            <th>Cantidad Vendida</th>
            <th>Valor de la venta</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {lastSales.map((sale) => (
            <tr className="secondTr" key={sale._id}>
              <td>{sale._id}</td>
              <td>{sale.quantitySold}</td>
              <td>{sale.salePrice}</td>
              <td>{new Date(sale.saleDate).toLocaleDateString()}</td>{" "}
              {/* Convierte la fecha a un formato más legible */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetLg;
