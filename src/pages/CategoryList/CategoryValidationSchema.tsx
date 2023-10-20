import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  categoryName: yup.string()
    .min(5, 'El nombre de la categoría debe tener al menos 5 caracteres.')
    .max(9, 'El nombre de la categoría no debe exceder de 9 caracteres.')
    .required('El nombre de la categoría es requerido.'),
  associatedColor: yup.string()
    .required('El color asociado es requerido.')
});