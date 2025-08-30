import axios from "axios";

export async function getEmpleados() {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/empleados/list");
        return response;
    } catch (error) { //objeto error creado por axios, atributos: messege, response, etc.
        console.log(error.response);
        throw new Error(error.response?.data?.message || "Error al obtener empleados");
        //objeto Error menos complejo,atributos: message (pasado al contructor),name y stack, el throw lo propaga al siguente try-catch
    }
}

export async function createEmpleado(nuevoEmpleado) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/empleados/create/", nuevoEmpleado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el empleado");
  }
}

export async function updateEmpleado(id, empleadoActualizado) {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/empleados/${id}/update/`, empleadoActualizado);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el empleado");
  }
}

export async function deleteEmpleado(id) {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/delete/`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el empleado");
  }
}