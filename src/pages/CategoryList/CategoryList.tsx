import "./CategoryList.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../../api";
import { Category, TransformedCategory } from "../../interfaces";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { validationSchema } from "./CategoryValidationSchema";
import * as yup from "yup";

const CategoryList = () => {
  const [data, setData] = useState<TransformedCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [associatedColor, setAssociatedColor] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadCategories = () => {
    api
      .get("/categories")
      .then((response) => {
        const transformedData = response.data.categories.map(
          (category: Category) => ({
            id: category._id,
            category: category.categoryName,
            color: category.associatedColor,
            createdAt: category.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
              : "N/A",
            updatedAt: category.updatedAt
              ? new Date(category.updatedAt).toLocaleDateString()
              : "N/A",
          })
        );
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las categorías:", error);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      try {
        await api.delete(`/categories/${id}`);
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

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        categoryName,
        associatedColor,
      });
      // Realizar la petición POST
      const response = await api.post("/categories", {
        categoryName,
        associatedColor,
      });

      // Comprobar el estado de la respuesta
      if (response.status === 200 || response.status === 201) {
        alert("Categoría creada con éxito.");
        handleClose(); // Cierra el modal después de un éxito
        loadCategories();
      } else {
        alert("Hubo un error al crear la categoría.");
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        alert(error.message); // Mostrar el mensaje de error específico al usuario
      } else {
        console.error("Hubo un error al enviar los datos:", error);
      }
    }
  };

  const columns: any[] = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "category", headerName: "Nombre de categoria", width: 250 },
    { field: "color", headerName: "Color asociado", width: 250 },
    {
      field: "createdAt",
      headerName: "Fecha de creación",
      width: 250,
    },
    {
      field: "updatedAt",
      headerName: "Fecha de actualización",
      width: 250,
    },
    {
      field: "action",
      headerName: "",
      width: 250,
      renderCell: (params: any) => {
        return (
          <>
            <Link to={`/user/${params.row._id}`}>
              <button className="editButton">Editar</button>
            </Link>
            <DeleteOutline
              className="deleteButton"
              onClick={() => handleDelete(params.id)}
            />
          </>
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
        Agregar nueva categoría
      </Typography>
      <form noValidate autoComplete="off">
        <div>
          <TextField
            margin="dense"
            id="category-name"
            label="Nombre de Categoría"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <div>
          <TextField
            margin="dense"
            id="associated-color"
            label="Color Asociado"
            type="color"
            fullWidth
            value={associatedColor}
            onChange={(e) => setAssociatedColor(e.target.value)}
          />
        </div>
      </form>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={handleClose}>Cerrar</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Box>
  );

  return (
    <div className="userListPage">
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
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default CategoryList;
