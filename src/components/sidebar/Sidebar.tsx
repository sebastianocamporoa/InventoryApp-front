import "./sidebar.scss";

import {
  LineStyle,
  TrendingUp,
  Storefront,
  DynamicFeed,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarComponent">
      <div className="wrapper">
        <div className="menu">
          <ul>
            <Link to="/" className="link">
              <li>
                <LineStyle className="icon" />
                Inicio
              </li>
            </Link>
            <Link to="/products" className="link">
              <li>
                <Storefront className="icon" />
                Inventario
              </li>
            </Link>
            <Link to="/categories" className="link">
              <li>
                <DynamicFeed className="icon" />
                Categorias
              </li>
            </Link>
            <Link to="/newPurchase" className="link">
              <li>
                <TrendingUp className="icon" />
                Venta de productos
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
