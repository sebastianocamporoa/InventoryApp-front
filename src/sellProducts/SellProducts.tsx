import React, { useState, useEffect } from "react";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import api from "../api";
import { Category, Product, TransformedProduct } from "../interfaces";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

const SellProducts = () => {
  const [data, setData] = useState<TransformedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(data);
  const [selectedProduct, setSelectedProduct] =
    useState<TransformedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantityToSell, setQuantityToSell] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);

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
              unitCost: product.unitCost,
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
    const results = data.filter(
      (p) => p.name.includes(searchTerm) || p.category.includes(searchTerm)
    );
    setFilteredProducts(results);
  };

  const handleOpenModal = (product: TransformedProduct) => {
    setSelectedProduct(product);
    setQuantityToSell(0);
    setSalePrice(product.unitCost);
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
    { field: "name", headerName: "Nombre del Producto", width: 250 },
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

  const handleSell = async () => {
    if (selectedProduct) {
      try {
        const response = await api.post("/products/sell", {
          productName: selectedProduct.name,
          productCategory: selectedProduct.category,
          quantitySold: quantityToSell,
          salePrice: salePrice,
        });

        if (response.status === 201) {
          alert("Venta realizada con éxito");
          handleCloseModal(); // Cierra el modal después de la venta
          loadProducts(); // Recarga los productos para mostrar las cantidades actualizadas
        } else {
          alert("Error en la venta");
        }
      } catch (error) {
        console.error("Hubo un error al vender el producto:", error);
      }
    }
  };

  const modalBody = (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" component="h2">
        Vender {selectedProduct?.name}
      </Typography>
      <br />
      <form noValidate autoComplete="off">
        <TextField
          margin="dense"
          id="quantity"
          label="Cantidad a Vender"
          type="number"
          fullWidth
          value={quantityToSell}
          onChange={(e) => setQuantityToSell(Number(e.target.value))}
        />

        <TextField
          margin="dense"
          id="quantity"
          label="Precio de Venta"
          type="number"
          fullWidth
          value={salePrice}
          onChange={(e) => setSalePrice(Number(e.target.value))}
        />
        {/* Botones del formulario */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handleCloseModal}>Cerrar</Button>
          <Button variant="contained" color="primary" onClick={handleSell}>
            Confirmar Venta
          </Button>
        </Box>
      </form>
    </Box>
  );

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

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {modalBody}
        </Modal>
      )}

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
