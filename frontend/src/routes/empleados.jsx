import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from "../helpers/empleado/empleadosService";

export default function Empleados() {

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
  
  // Estados para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Datos de ejemplo para demostración
  // Obtener empleados al inicio
  const ObtenerEmpleados = async () => {
    try {
      const response = await getEmpleados();
      setEmpleados(response.data.empleados);
    } catch (error) {
      console.error("Error al obtener los empleados", error);
    }
  };

  useEffect(() => {
    ObtenerEmpleados();
  }, []);

  // Función de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener empleados filtrados y ordenados
  const getFilteredAndSortedEmpleados = () => {
    let filteredEmpleados = empleados.filter(empleado => {
      const matchesSearch = 
      
        (empleado.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (empleado.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (empleado.rol?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesEstado = filterEstado === "todos" || empleado.estado === filterEstado;
      
      return matchesSearch && matchesEstado;
    });

    if (sortConfig.key) {
      filteredEmpleados.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredEmpleados;
  };

  // Paginación
  const filteredEmpleados = getFilteredAndSortedEmpleados();
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmpleados = filteredEmpleados.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return "↕️";
    return sortConfig.direction === 'asc' ? "↑" : "↓";
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: "badge bg-success",
      inactivo: "badge bg-secondary", 
      suspendido: "badge bg-warning text-dark",
      baja: "badge bg-danger"
    };
    return badges[estado] || "badge bg-secondary";
  };

  const crearEmpleado = async () => {
    try {
      const nuevoEmpleado = {
        nombre,
        apellido,
        edad,
        rol,
        fecha_ingreso: fechaIngreso,
        salario,
        estado,
      };
      console.log("Datos enviados:", nuevoEmpleado); // Para depuración
      await createEmpleado(nuevoEmpleado);
      alert("Empleado registrado");
      await ObtenerEmpleados(); // Asegura que la lista se actualice después de crear
      limpiarFormulario();
    } catch (error) {
      console.error("Respuesta del servidor:", error.message);
      alert(error.message);
    }
  };

  const actualizarEmpleado = async () => {
    try {
        const empleadoActualizado = {
          nombre,
          apellido,
          edad,
          rol,
          fecha_ingreso: fechaIngreso,
          salario,
          estado,
        };
        console.log("Datos enviados para actualizar:", empleadoActualizado);
        await updateEmpleado(idEmpleado, empleadoActualizado);
      alert("Empleado actualizado");
        await ObtenerEmpleados();
      setEditar(false);
      limpiarFormulario();
    } catch (error) {
        console.error("Error al obtener los empleados", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este empleado?")) {
      try {
        await deleteEmpleado(id);
        alert("Empleado eliminado");
        await ObtenerEmpleados();
      } catch (error) {
        console.error("Error:", error);
      }
    }
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
    <div className="container-fluid">
      {/* Header con estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">👨‍💼 Gestión de Empleados</h2>
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="badge bg-primary fs-6">{empleados.length}</div>
                <small className="d-block text-muted">Total</small>
              </div>
              <div className="text-center">
                <div className="badge bg-success fs-6">{empleados.filter(e => e.estado === 'activo').length}</div>
                <small className="d-block text-muted">Activos</small>
              </div>
              <div className="text-center">
                <div className="badge bg-warning fs-6">{empleados.filter(e => e.estado === 'suspendido').length}</div>
                <small className="d-block text-muted">Suspendidos</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Formulario */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {editar ? "✏️ Editar Empleado" : "➕ Nuevo Empleado"}
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">👤 Nombre</label>
                    <input 
                      type="text" 
                      value={nombre} 
                      onChange={(e) => setNombre(e.target.value)} 
                      className="form-control" 
                      placeholder="Ingresa el nombre"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Apellido</label>
                    <input 
                      type="text" 
                      value={apellido} 
                      onChange={(e) => setApellido(e.target.value)} 
                      className="form-control"
                      placeholder="Ingresa el apellido"
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label className="form-label fw-bold">Edad</label>
                    <input 
                      type="number" 
                      value={edad} 
                      onChange={(e) => setEdad(e.target.value)} 
                      className="form-control"
                      min="18"
                      max="65"
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label className="form-label fw-bold">📋 Estado</label>
                    <select 
                      value={estado} 
                      className="form-select" 
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="activo">✅ Activo</option>
                      <option value="inactivo">⭕ Inactivo</option>
                      <option value="suspendido">⚠️ Suspendido</option>
                      <option value="baja">❌ Baja</option>
                    </select>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">💼 Rol</label>
                    <input 
                      type="text" 
                      value={rol} 
                      onChange={(e) => setRol(e.target.value)} 
                      className="form-control"
                      placeholder="ej: Desarrollador, Diseñador"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">📅 Fecha de Ingreso</label>
                    <input 
                      type="date" 
                      value={fechaIngreso} 
                      onChange={(e) => setFechaIngreso(e.target.value)} 
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">💰 Salario</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number" 
                        value={salario} 
                        onChange={(e) => setSalario(e.target.value)} 
                        className="form-control"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="card-footer">
              {editar ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-warning" onClick={actualizarEmpleado}>
                    ✏️ Actualizar Empleado
                  </button>
                  <button className="btn btn-outline-secondary" onClick={limpiarFormulario}>
                    ❌ Cancelar
                  </button>
                </div>
              ) : (
                <div className="d-grid">
                  <button className="btn btn-success" onClick={crearEmpleado}>
                    ➕ Crear Empleado
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de empleados */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">📊 Lista de Empleados</h5>
                </div>
                <div className="col-md-6">
                  <div className="row g-2">
                    <div className="col-md-7">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">🔍</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar empleado..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <select
                        className="form-select form-select-sm"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                      >
                        <option value="todos">Todos los estados</option>
                        <option value="activo">✅ Activos</option>
                        <option value="inactivo">⭕ Inactivos</option>
                        <option value="suspendido">⚠️ Suspendidos</option>
                        <option value="baja">❌ Bajas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('id_empleado')}
                      >
                        # {getSortIcon('id_empleado')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('nombre')}
                      >
                        Nombre {getSortIcon('nombre')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('apellido')}
                      >
                        Apellido {getSortIcon('apellido')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('edad')}
                      >
                        Edad {getSortIcon('edad')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('rol')}
                      >
                        💼 Rol {getSortIcon('rol')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('salario')}
                      >
                        💰 Salario {getSortIcon('salario')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('estado')}
                      >
                        📋 Estado {getSortIcon('estado')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('fecha_ingreso')}
                      >
                        📅 Ingreso {getSortIcon('fecha_ingreso')}
                      </th>
                      <th>⚙️ Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmpleados.map((val) => (
                      <tr key={val.id_empleado}>
                        <td><span className="badge bg-light text-dark">{val.id_empleado}</span></td>
                        <td><strong>{val.nombre}</strong></td>
                        <td>{val.apellido}</td>
                        <td>{val.edad} años</td>
                        <td>
                          <span className="badge bg-info text-dark">{val.rol}</span>
                        </td>
                        <td><strong>${val.salario?.toLocaleString()}</strong></td>
                        <td>
                          <span className={getEstadoBadge(val.estado)}>
                            {val.estado.charAt(0).toUpperCase() + val.estado.slice(1)}
                          </span>
                        </td>
                        <td>{val.fecha_ingreso}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => editarEmpleado(val)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => eliminarEmpleado(val.id_empleado)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEmpleados.length === 0 && (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <h5>No se encontraron empleados</h5>
                    <p>Intenta cambiar los filtros de búsqueda</p>
                  </div>
                </div>
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="card-footer">
                <nav>
                  <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        « Anterior
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente »
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEmpleados.length)} de {filteredEmpleados.length} empleados
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}