import React, { useState, useEffect } from "react";
import api from "../api";
import "./BuyProducts.scss";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Category, Product, TransformedProduct } from "../interfaces";

const BuyProducts = () => {
  const [productList, setProductList] = useState<TransformedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<TransformedProduct | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then((response) => {
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error("Error: la respuesta no es un array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las categorías:", error);
      });
  }, []);

  const loadProducts = async () => {
    await api
      .get("/products")
      .then((response) => {
        const transformedData = response.data.map((product: Product) => {
          const associatedCategory = categories.find(
            (cat) => cat._id === product.category
          );
          return {
            ...product,
            category: associatedCategory
              ? associatedCategory.categoryName
              : product.category,
          };
        });
        console.log(response.data);
        setProductList(transformedData);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductSelection = (event: SelectChangeEvent<string>) => {
    const product = productList.find((p) => p.name === event.target.value);
    if (product) {
      setSelectedProduct(product);
      setCategory(product.category);
    } else {
      setSelectedProduct(null);
      setCategory("");
    }
  };

  const handleSubmit = () => {
    // Tu lógica para manejar la presentación del formulario va aquí
    // ...
  };

  return (
    <div className="userPage">
      <div className="titleContainer">
        <h1>Compra de productos</h1>
      </div>
      <div className="userContainer">
        <div className="update">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="left">
              <div className="updateItem">
                <FormControl variant="outlined" margin="normal">
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={selectedProduct ? selectedProduct.name : ""}
                    onChange={handleProductSelection}
                    label="Producto"
                  >
                    {productList.map((product) => (
                      <MenuItem key={product.name} value={product.name}>
                        {product.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="">Nuevo producto</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="updateItem">
                {!selectedProduct && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Nombre del producto"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                )}
              </div>
              <div className="updateItem">
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Categoría"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={!!selectedProduct}
                />
              </div>
              <div className="updateItem">
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="updateItem">
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Costo Unitario"
                  type="number"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                />
              </div>
              <div className="updateItem">
                <Button type="submit" variant="contained" color="primary">
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyProducts;
