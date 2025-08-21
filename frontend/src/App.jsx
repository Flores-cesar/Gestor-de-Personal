import './App.css'
import { useState, useEffect } from "react"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [rol, setRol] = useState(""); 
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [salario, setSalario] = useState("");
  const [estado, setEstado] = useState("activo");
  const [empleados, setEmpleados] = useState([]);
  const [editar, setEditar] = useState(false);
  const [idEmpleado, setIdEmpleado] = useState(null);

  // Obtener empleados al inicio
  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = () => {
    Axios.get("http://127.0.0.1:8000/api/empleados/list").then((response) => {
      setEmpleados(response.data.empleados);
    });
  };

  const addEmpleado = () => {
    Axios.post("http://127.0.0.1:8000/api/empleados/create/", {
      nombre,
      apellido,
      edad,
      rol,
      fecha_ingreso: fechaIngreso,
      salario,
      estado,
    }).then(() => {
      alert("Empleado registrado");
      getEmpleados();
      limpiarFormulario();
    });
  };

  const updateEmpleado = () => {
    Axios.put(`http://127.0.0.1:8000/api/empleados/${idEmpleado}/update/`, {
      nombre,
      apellido,
      edad,
      rol,
      fecha_ingreso: fechaIngreso,
      salario,
      estado,
    }).then(() => {
      alert("Empleado actualizado");
      getEmpleados();
      setEditar(false);
      limpiarFormulario();
    });
  };

  const deleteEmpleado = (id) => {
    Axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/delete/`).then(() => {
      alert("Empleado eliminado");
      getEmpleados();
    });
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setIdEmpleado(val.id_empleado);
    setNombre(val.nombre);
    setApellido(val.apellido);
    setEdad(val.edad);
    setRol(val.rol);
    setFechaIngreso(val.fecha_ingreso);
    setEstado(val.estado);
    setSalario(val.salario);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setEdad("");
    setRol("");
    setFechaIngreso("");
    setSalario("");
    setEstado("activo");
    setIdEmpleado(null);
    setEditar(false);
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestión de empleados</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Rol</label>
            <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha ingreso</label>
            <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Salario</label>
            <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} className="form-control" />
          </div>

          <div className="col-md-4">
            <label className="form-label">Estado</label>
            <select value={estado} className="form-select" onChange={(e) => setEstado(e.target.value)}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateEmpleado}>Actualizar</button>
              <button className="btn btn-info m-2" onClick={limpiarFormulario}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={addEmpleado}>Crear Empleado</button>
          )}
        </div>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Rol</th>
            <th>Salario</th>
            <th>Estado</th>
            <th>Fecha ingreso</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {empleados.map((val) => (
            <tr key={val.id_empleado}>
              <td>{val.id_empleado}</td>
              <td>{val.nombre}</td>
              <td>{val.apellido}</td>
              <td>{val.edad}</td>
              <td>{val.rol}</td>
              <td>{val.salario}</td>
              <td>{val.estado}</td>
              <td>{val.fecha_ingreso}</td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => editarEmpleado(val)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteEmpleado(val.id_empleado)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
