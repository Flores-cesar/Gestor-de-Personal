import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL; // Lee la variable VITE_API_URL
const BASE_URL = `${apiUrl}/api/roles`;

export async function getRoles() {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener roles");
  }
}

export async function createRol(nuevoRol) {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, nuevoRol);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el rol");
  }
}

export async function updateRol(id, rolActualizado) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}/update/`, rolActualizado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el rol");
  }
}

export async function deleteRol(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}/delete/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el rol");
  }
}
