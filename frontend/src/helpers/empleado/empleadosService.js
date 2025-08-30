import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL; // Lee la variable VITE_API_URL
const BASE_URL = `${apiUrl}/api/empleados`;
export async function getEmpleados() {
    try {
        const response = await axios.get(`${BASE_URL}/list/`);
        return response;
    } catch (error) { //objeto error creado por axios, atributos: messege, response, etc.
        console.log(error.response);
        throw new Error(error.response?.data?.message || "Error al obtener empleados");
        //objeto Error menos complejo,atributos: message (pasado al contructor),name y stack, el throw lo propaga al siguente try-catch
    }
}

export async function createEmpleado(nuevoEmpleado) {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, nuevoEmpleado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el empleado");
  }
}

export async function updateEmpleado(id, empleadoActualizado) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}/update/`, empleadoActualizado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el empleado");
  }
}

export async function deleteEmpleado(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}/delete/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el empleado");
  }
}