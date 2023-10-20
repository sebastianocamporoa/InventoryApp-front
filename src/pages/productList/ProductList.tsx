import { useEffect, useState } from "react";
import "./productList.scss";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import api from "../../api";
import { Category, Product, TransformedProduct } from "../../interfaces";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

const ProductList = () => {
  const [data, setData] = useState<TransformedProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [averageUnitCost, setAverageUnitCost] = useState("");
  const [currentSalePrice, setCurrentSalePrice] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<TransformedProduct | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const doesProductExist = (name: string, category: string) => {
    return data.some(
      (product) => product.name === name && product.category === category
    );
  };

  useEffect(() => {
    loadProducts();
  }, [categories]);

  const groupAndSumProducts = (products: TransformedProduct[]) => {
    const CALCULATION_FACTOR = 0.25;
    const groupedProducts: { [key: string]: TransformedProduct } = {};
    let mostExpensiveProduct: TransformedProduct | null = null;

    products.forEach((product) => {
      const key = `${product.name}-${product.category}`; // Usamos nombre y categoría como clave única.
      if (groupedProducts[key]) {
        // Comprobar y actualizar el producto más caro.
        if (
          !mostExpensiveProduct ||
          product.unitCost > mostExpensiveProduct.unitCost
        ) {
          mostExpensiveProduct = product;
        }
        groupedProducts[key].quantity += product.quantity; // Sumamos la cantidad si ya existe una entrada con esa clave.

        let currentCost =
          groupedProducts[key].createdAt < product.createdAt
            ? groupedProducts[key].unitCost
            : product.unitCost;
        let newBatchCost =
          groupedProducts[key].createdAt > product.createdAt
            ? groupedProducts[key].unitCost
            : product.unitCost;

        // Cálculo del CostoPromedio
        const costAverage = (currentCost + newBatchCost) / 2;

        // Cálculo final del costo
        let averageUnitCost =
          costAverage +
          (mostExpensiveProduct.unitCost - costAverage) * CALCULATION_FACTOR;
        groupedProducts[key].averageUnitCost = averageUnitCost;

        //Precio de venta actual
        groupedProducts[key].currentSalePrice =
          averageUnitCost + averageUnitCost * 0.2;

        // Para la fecha de registro, tomamos la más vieja.
        if (
          new Date(groupedProducts[key].createdAt) > new Date(product.createdAt)
        ) {
          groupedProducts[key].createdAt = product.createdAt;
        }

        // Para la fecha de actualización, tomamos la más nueva.
        if (
          new Date(groupedProducts[key].updatedAt) < new Date(product.updatedAt)
        ) {
          groupedProducts[key].updatedAt = product.updatedAt;
        }
      } else {
        groupedProducts[key] = product; // Si no existe, simplemente añadimos el producto.
      }
    });

    return Object.values(groupedProducts); // Devolvemos los productos agrupados como un array.
  };

  const loadProducts = () => {
    api
      .get("/products")
      .then((response) => {
        const transformedData = response.data.map((product: Product) => {
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
            averageUnitCost: `$${product.averageUnitCost}`,
            currentSalePrice: `$${product.currentSalePrice}`,
            createdAt: product.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : "N/A",
            updatedAt: product.updatedAt
              ? new Date(product.updatedAt).toLocaleDateString()
              : "N/A",
          };
        });
        const groupedData = groupAndSumProducts(transformedData); // Usamos la función para agrupar y sumar.
        setData(groupedData);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setProductName("");
    setProductCategory("");
    setQuantity("");
    setAverageUnitCost("");
    setCurrentSalePrice("");
    setNewProductName("");
    setSelectedProduct(null);
  };

  const handleDelete = async (id: string | number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      try {
        await api.delete(`/products/${id}`);
        // Una vez eliminada la categoría del servidor, la eliminamos del estado local
        alert("Se eliminó la categoria correctamente.");
        setData((prevData) => {
          const newData = prevData.filter((item) => item.id !== id);
          return newData;
        });
        setRefreshKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Hubo un error al eliminar la categoría:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const body = {
        name: selectedProduct ? selectedProduct.name : newProductName,
        category: productCategory,
        quantity: quantity,
        unitCost: averageUnitCost,
      };
      const response = await api.post("/products", body);

      // Comprobar el estado de la respuesta
      if (response.status === 200 || response.status === 201) {
        alert("Categoría creada con éxito.");
        handleClose();
        loadProducts();
      } else {
        alert("Hubo un error al crear la categoría.");
      }
    } catch (error) {
      console.error("Hubo un error al enviar los datos:", error);
    }
  };

  const isColorDark = (hexColor: string) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.5;
  };

  const handleProductSelection = (event: SelectChangeEvent<string>) => {
    const product = data.find((p) => p.name === event.target.value);
    if (product) {
      const matchedCategory = categories.find(
        (cat) => cat.categoryName === product.category
      );
      setSelectedProduct(product);
      setProductCategory(matchedCategory ? matchedCategory._id : "");
    } else {
      setSelectedProduct(null);
      setProductCategory("");
    }
  };

  const columns: any[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Producto", width: 100 },
    {
      field: "quantity",
      headerName: "Cantidad en existencia",
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        const quantity = params.value;
        let bgColor;

        if (quantity < 100) {
          bgColor = "red";
        } else if (quantity >= 100 && quantity < 200) {
          bgColor = "orange";
        } else {
          bgColor = "transparent";
        }
        return (
          <div
            style={{
              backgroundColor: bgColor,
              width: "100%",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            {quantity}
          </div>
        );
      },
    },
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
      field: "averageUnitCost",
      headerName: "Costo unitario promedio",
      width: 180,
    },
    {
      field: "currentSalePrice",
      headerName: "Precio de venta actual",
      width: 180,
    },
    {
      field: "createdAt",
      headerName: "Fecha de creación",
      width: 200,
    },
    {
      field: "updatedAt",
      headerName: "Fecha de actualización",
      width: 200,
    },
    {
      field: "action",
      headerName: "",
      width: 150,
      renderCell: (params: any) => {
        return (
          <DeleteOutline
            className="deleteButton"
            onClick={() => handleDelete(params.id)}
          />
        );
      },
    },
  ];

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
        Agregar nuevo producto
      </Typography>
      <br />
      <form noValidate autoComplete="off">
        {/* Nombre del producto */}
        <div>
          <TextField
            select
            margin="dense"
            label="Producto"
            fullWidth
            value={selectedProduct ? selectedProduct.name : ""}
            onChange={(e) => {
              handleProductSelection(e as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <MenuItem value="">Nuevo producto</MenuItem>
            {data.map((product) => (
              <MenuItem key={product.name} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
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

        {/* Categoría del producto */}
        <div>
          <TextField
            select
            margin="dense"
            id="product-category"
            label="Categoría"
            fullWidth
            value={productCategory}
            onChange={(e) => {
              setProductCategory(e.target.value);
            }}
          >
            {Array.isArray(categories) &&
              categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
          </TextField>
        </div>

        {/* Cantidad en existencia */}
        <div>
          <TextField
            margin="dense"
            id="quantity"
            label="Cantidad de unidades"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Costo unitario promedio */}
        <div>
          <TextField
            margin="dense"
            id="averageUnitCost"
            label="Costo unitario"
            type="number"
            fullWidth
            value={averageUnitCost}
            onChange={(e) => {
              setAverageUnitCost(e.target.value);
            }}
          />
        </div>

        {/* Botones del formulario */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </form>
    </Box>
  );

  return (
    <div className="productListPage">
      <div className="buttonContainer">
        <button className="addButton" onClick={handleOpen}>
          Agregar
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalBody}
      </Modal>
      <DataGrid
        key={refreshKey}
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={13}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default ProductList;
