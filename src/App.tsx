import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import ProductList from "./pages/productList/ProductList";
import CategoryList from "./pages/CategoryList/CategoryList";
import "./styles/app.scss";

function App() {
  return (
    <Router>
      <Topbar />
      <div className="containerApp">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
