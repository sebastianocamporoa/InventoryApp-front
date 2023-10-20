import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import api from "../api";
import { Category, Product, TransformedProduct } from "../interfaces";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

const products = [
  { id: 1, name: "Producto A", category: "Categoría 1", stock: 5, price: 100 },
  { id: 2, name: "Producto B", category: "Categoría 2", stock: 0, price: 150 },
  // ... Añade más productos aquí
];

const SellProducts = () => {
  const [data, setData] = useState<TransformedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] =
    useState<TransformedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    loadProducts();
  }, [categories]);

  type GroupedProduct = {
    [key: string]: Product;
  };

  const groupProducts = (products: Product[]): Product[] => {
    const grouped: GroupedProduct = products.reduce(
      (acc: GroupedProduct, product) => {
        const key = `${product.name}-${product.category}`; // clave única para nombre y categoría
        if (!acc[key]) {
          acc[key] = { ...product };
        } else {
          // Sumar quantity
          acc[key].quantity += product.quantity;
          // Si la fecha de actualización del producto es más reciente, actualiza el precio
          if (new Date(acc[key].updatedAt) < new Date(product.updatedAt)) {
            acc[key].unitCost = product.unitCost;
            acc[key].updatedAt = product.updatedAt;
          }
        }
        return acc;
      },
      {}
    );

    return Object.values(grouped) as Product[]; // Convertir el objeto en un array
  };

  const loadProducts = () => {
    api
      .get("/products")
      .then((response) => {
        const rawProducts = response.data;
        const groupedAndProcessedProducts = groupProducts(rawProducts);
        const transformedData = groupedAndProcessedProducts.map(
          (product: Product) => {
            const associatedCategory = categories.find(
              (cat) => cat._id === product.category
            );
            return {
              ...product,
              id: product._id,
              category: associatedCategory
                ? associatedCategory.categoryName
                : product.category,
              associatedColor: associatedCategory
                ? associatedCategory.associatedColor
                : "transparent", // Guardamos el color asociado
              unitCost: product.unitCost
            };
          }
        );
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = () => {
    const results = products.filter(
      (p) => p.name.includes(searchTerm) || p.category.includes(searchTerm)
    );
    setFilteredProducts(results);
  };

  const handleOpenModal = (product: TransformedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const isColorDark = (hexColor: string) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.5;
  };

  const columns: any[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Nombre del Producto", width: 100 },
    {
      field: "category",
      headerName: "Categoria",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const category = params.value;
        const associatedColor = params.row.associatedColor;
        const textColor = isColorDark(associatedColor) ? "white" : "black";
        return (
          <div
            style={{
              backgroundColor: associatedColor,
              color: textColor,
              width: "100%",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            {category}
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad en existencia",
      width: 180,
    },
    {
      field: "unitCost",
      headerName: "Precio de venta actual",
      width: 180,
    },
    {
      field: "action",
      headerName: "",
      width: 150,
      renderCell: (params: any) => {
        return (
          <Button onClick={() => handleOpenModal(params.row)}>Vender</Button>
        );
      },
    },
  ];

  return (
    <div className="productListPage">
      <TextField
        label="Buscar Producto"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={handleSearch} startIcon={<Search />}>
        Buscar
      </Button>

      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={13}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default SellProducts;
