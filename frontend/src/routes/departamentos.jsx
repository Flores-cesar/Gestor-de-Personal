import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { getDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento } from "../helpers/departamento/departamentosService";
import { getEmpleados } from "../helpers/empleado/empleadosService";

export default function Departamentos() {

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [responsableId, setResponsableId] = useState("");
  const [parentId, setParentId] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Para mostrar nombre del responsable
  const [editar, setEditar] = useState(false);
  const [idDepartamento, setIdDepartamento] = useState(null);
  
  // Estados para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterResponsable, setFilterResponsable] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Obtener departamentos al inicio
  const ObtenerDepartamentos = async () => {
    try {
      const response = await getDepartamentos();
      setDepartamentos(response.data.departamentos);
    } catch (error) {
      console.error("Error al obtener los departamentos", error);
    }
  };

  // Obtener empleados para mostrar nombres de responsables
  const ObtenerEmpleados = async () => {
    try {
      const response = await getEmpleados();
      setEmpleados(response.data.empleados);
    } catch (error) {
      console.error("Error al obtener los empleados", error);
    }
  };

  useEffect(() => {
    ObtenerDepartamentos();
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

  // Función para obtener el nombre del responsable
  const getNombreResponsable = (responsableId) => {
    if (!responsableId) return 'Sin responsable';
    const empleado = empleados.find(e => e.id_empleado === responsableId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no encontrado';
  };

  // Función para obtener el nombre del departamento padre
  const getNombreDepartamentoPadre = (parentId) => {
    if (!parentId) return 'Sin departamento padre';
    const departamento = departamentos.find(d => d.id_departamento === parentId);
    return departamento ? departamento.nombre : 'Departamento no encontrado';
  };

  // Función para obtener departamentos filtrados y ordenados
  const getFilteredAndSortedDepartamentos = () => {
    let filteredDepartamentos = departamentos.filter(departamento => {
      const matchesSearch = 
        (departamento.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (departamento.descripcion?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        getNombreResponsable(departamento.responsable_id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesResponsable = filterResponsable === "todos" || 
        (filterResponsable === "sin_responsable" && !departamento.responsable_id) ||
        (filterResponsable === "con_responsable" && departamento.responsable_id);
      
      return matchesSearch && matchesResponsable;
    });

    if (sortConfig.key) {
      filteredDepartamentos.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Para responsable, comparamos por nombre
        if (sortConfig.key === 'responsable_id') {
          aValue = getNombreResponsable(a.responsable_id);
          bValue = getNombreResponsable(b.responsable_id);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredDepartamentos;
  };

  // Paginación
  const filteredDepartamentos = getFilteredAndSortedDepartamentos();
  const totalPages = Math.ceil(filteredDepartamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartamentos = filteredDepartamentos.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return "↕️";
    return sortConfig.direction === 'asc' ? "↑" : "↓";
  };

  const crearDepartamento = async () => {
    try {
      const nuevoDepartamento = {
        nombre,
        descripcion,
        responsable: responsableId ? parseInt(responsableId) : null,
        parent: parentId ? parseInt(parentId) : null,
      };
      console.log("Datos enviados:", nuevoDepartamento);
      await createDepartamento(nuevoDepartamento);
      alert("Departamento registrado");
      await ObtenerDepartamentos();
      limpiarFormulario();
    } catch (error) {
      console.error("Respuesta del servidor:", error.message);
      alert(error.message);
    }
  };

  const actualizarDepartamento = async () => {
    try {
      const departamentoActualizado = {
        nombre,
        descripcion,
        responsable: responsableId ? parseInt(responsableId) : null,
        parent: parentId ? parseInt(parentId) : null,
      };
      console.log("Datos enviados para actualizar:", departamentoActualizado);
      await updateDepartamento(idDepartamento, departamentoActualizado);
      alert("Departamento actualizado");
      await ObtenerDepartamentos();
      setEditar(false);
      limpiarFormulario();
    } catch (error) {
      alert(error.message);    
    }
  };

  const eliminarDepartamento = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este departamento?")) {
      try {
        await deleteDepartamento(id);
        alert("Departamento eliminado");
        await ObtenerDepartamentos();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const editarDepartamento = (val) => {
    setEditar(true);
    setIdDepartamento(val.id_departamento);
    setNombre(val.nombre);
    setDescripcion(val.descripcion || "");
    setResponsableId(val.responsable_id ? val.responsable_id.toString() : "");
    setParentId(val.parent_id ? val.parent_id.toString() : "");
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setResponsableId("");
    setParentId("");
    setIdDepartamento(null);
    setEditar(false);
  };

  return (
    <div className="container-fluid">
      {/* Header con estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Gestión de Departamentos</h2>
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="badge bg-primary fs-6">{departamentos.length}</div>
                <small className="d-block text-muted">Total</small>
              </div>
              <div className="text-center">
                <div className="badge bg-success fs-6">
                  {departamentos.filter(d => d.responsable_id).length}
                </div>
                <small className="d-block text-muted">Con Responsable</small>
              </div>
              <div className="text-center">
                <div className="badge bg-warning fs-6">
                  {departamentos.filter(d => !d.responsable_id).length}
                </div>
                <small className="d-block text-muted">Sin Responsable</small>
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
                {editar ? "✏️ Editar Departamento" : "➕ Nuevo Departamento"}
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Nombre del Departamento</label>
                  <input 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    className="form-control" 
                    placeholder="ej: Gerencia de Desarrollo Técnico"
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">📋 Descripción</label>
                  <textarea 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    className="form-control"
                    placeholder="Describe las funciones del departamento..."
                    rows="4"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">👤 ID Responsable</label>
                  <input 
                    type="number" 
                    value={responsableId} 
                    onChange={(e) => setResponsableId(e.target.value)} 
                    className="form-control" 
                    placeholder="Ingresa el ID del empleado responsable"
                    min="1"
                  />
                  <div className="form-text">
                    💡 Deja vacío si no tiene responsable asignado
                  </div>
                  {responsableId && (
                    <div className="mt-2">
                      <span className="badge bg-info">
                        Responsable: {getNombreResponsable(parseInt(responsableId))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">🏢 ID Departamento Padre</label>
                  <input 
                    type="number" 
                    value={parentId} 
                    onChange={(e) => setParentId(e.target.value)} 
                    className="form-control" 
                    placeholder="Ingresa el ID del departamento padre"
                    min="1"
                  />
                  <div className="form-text">
                    💡 Deja vacío si es un departamento principal
                  </div>
                  {parentId && (
                    <div className="mt-2">
                      <span className="badge bg-info">
                        Padre: {getNombreDepartamentoPadre(parseInt(parentId))}
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="card-footer">
              {editar ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-warning" onClick={actualizarDepartamento}>
                    Actualizar Departamento
                  </button>
                  <button className="btn btn-outline-secondary" onClick={limpiarFormulario}>
                    ❌ Cancelar
                  </button>
                </div>
              ) : (
                <div className="d-grid">
                  <button className="btn btn-success" onClick={crearDepartamento}>
                    ➕ Crear Departamento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de departamentos */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">📊 Lista de Departamentos</h5>
                </div>
                <div className="col-md-6">
                  <div className="row g-2">
                    <div className="col-md-7">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">🔍</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar departamento..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <select
                        className="form-select form-select-sm"
                        value={filterResponsable}
                        onChange={(e) => setFilterResponsable(e.target.value)}
                      >
                        <option value="todos">Todos</option>
                        <option value="con_responsable">Con responsable</option>
                        <option value="sin_responsable">Sin responsable</option>
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
                        onClick={() => handleSort('id_departamento')}
                      >
                        # {getSortIcon('id_departamento')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('nombre')}
                      >
                        Nombre {getSortIcon('nombre')}
                      </th>
                      <th>📋 Descripción</th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('responsable_id')}
                      >
                        Responsable {getSortIcon('responsable_id')}
                      </th>
                      <th>
                        Dep. Padre
                      </th>
                      <th>⚙️ Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDepartamentos.map((val) => (
                      <tr key={val.id_departamento}>
                        <td><span className="badge bg-light text-dark">{val.id_departamento}</span></td>
                        <td><strong>{val.nombre}</strong></td>
                        <td>
                          <span className="text-muted" title={val.descripcion}>
                            {val.descripcion && val.descripcion.length > 60 
                              ? val.descripcion.substring(0, 60) + "..." 
                              : val.descripcion || "Sin descripción"}
                          </span>
                        </td>
                        <td>
                          {val.responsable_id ? (
                            <div>
                              <span className="badge bg-success">
                                {getNombreResponsable(val.responsable_id)}
                              </span>
                              <br />
                              <small className="text-muted">ID: {val.responsable_id}</small>
                            </div>
                          ) : (
                            <span className="badge bg-secondary">Sin responsable</span>
                          )}
                        </td>
                        <td>
                          {val.parent_id ? (
                            <div>
                              <span className="badge bg-primary">
                                {getNombreDepartamentoPadre(val.parent_id)}
                              </span>
                              <br />
                              <small className="text-muted">ID: {val.parent_id}</small>
                            </div>
                          ) : (
                            <span className="badge bg-secondary">Dep. Principal</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => editarDepartamento(val)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => eliminarDepartamento(val.id_departamento)}
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

              {filteredDepartamentos.length === 0 && (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <h5>No se encontraron departamentos</h5>
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
                    Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDepartamentos.length)} de {filteredDepartamentos.length} departamentos
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