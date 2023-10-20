import api from "../../api";
import { useEffect, useState } from "react";
import "./widgetSm.scss";
import { ProductSummary } from "../../interfaces";

const WidgetSm = () => {
  const [lastProducts, setlastProducts] = useState<ProductSummary[]>([]);

  useEffect(() => {
    api
      .get("/products/recent")
      .then((response) => {
        setlastProducts(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  }, []);

  return (
    <div className="widgetSmComponent">
      <span className="title">Últimos productos agregados</span>
      <ul>
        {lastProducts && lastProducts.length > 0 ? (
          lastProducts.map((product, index) => (
            <li key={index}>
              <div>
                <span className="product">{product._id.name}</span>
                <span className="category">{product.categoryName}</span>
              </div>
            </li>
          ))
        ) : (
          <li>No hay registros</li>
        )}
      </ul>
    </div>
  );
};

export default WidgetSm;
