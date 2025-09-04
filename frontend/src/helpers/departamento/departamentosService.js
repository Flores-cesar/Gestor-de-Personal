import axios from "axios";
import { API_URL } from "../../config";

const BASE_URL = `${API_URL}/api/departamentos`;

export async function getDepartamentos() {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener departamentos");
  }
}

export async function createDepartamento(nuevoDepartamento) {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, nuevoDepartamento);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el departamento");
  }
}

export async function updateDepartamento(id, departamentoActualizado) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}/update/`, departamentoActualizado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el departamento");
  }
}

export async function deleteDepartamento(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}/delete/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el departamento");
  }
}
