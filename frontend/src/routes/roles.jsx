import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { getRoles, createRol, updateRol, deleteRol } from "../helpers/rol/rolesService";
import { getDepartamentos } from "../helpers/departamento/departamentosService";
export default function Roles() {

  const [nombre, setNombre] = useState("");
  const [responsabilidades, setResponsabilidades] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]); // Para mostrar nombres de departamentos
  const [editar, setEditar] = useState(false);
  const [idRol, setIdRol] = useState(null);
  
  // Estados para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterDepartamento, setFilterDepartamento] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Obtener roles al inicio
  const ObtenerRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error al obtener los roles", error);
    }
  };

  const ObtenerDepartamentos = async () => {
    try {
      const response = await getDepartamentos();
      setDepartamentos(response.data.departamentos);

    } catch (error) {
      console.error("Error al obtener los departamentos", error);
    }
  };

  useEffect(() => {
    ObtenerRoles();
    ObtenerDepartamentos();
  }, []);

  // Función de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener el nombre del departamento
  const getNombreDepartamento = (departamentoId) => {
    const departamento = departamentos.find(d => d.id_departamento === departamentoId);
    return departamento ? departamento.nombre : 'Departamento no encontrado';
  };

  // Función para obtener roles filtrados y ordenados
  const getFilteredAndSortedRoles = () => {
    let filteredRoles = roles.filter(rol => {
      const matchesSearch = 
        (rol.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (rol.responsabilidades?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        getNombreDepartamento(rol.departamento_id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartamento = filterDepartamento === "todos" || 
        rol.departamento_id.toString() === filterDepartamento;
      
      return matchesSearch && matchesDepartamento;
    });

    if (sortConfig.key) {
      filteredRoles.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Para departamento, comparamos por nombre
        if (sortConfig.key === 'departamento_id') {
          aValue = getNombreDepartamento(a.departamento_id);
          bValue = getNombreDepartamento(b.departamento_id);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredRoles;
  };

  // Paginación
  const filteredRoles = getFilteredAndSortedRoles();
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return "↕️";
    return sortConfig.direction === 'asc' ? "↑" : "↓";
  };

  const crearRol = async () => {
    try {
      const nuevoRol = {
        nombre,
        responsabilidades,
        departamento: parseInt(departamentoId),
      };
      console.log("Datos enviados:", nuevoRol);
      await createRol(nuevoRol);
      alert("Rol registrado");
      await ObtenerRoles();
      limpiarFormulario();
    } catch (error) {
      console.error("Respuesta del servidor:", error.message);
      alert(error.message);
    }
  };

  const actualizarRol = async () => {
    try {
      const rolActualizado = {
        nombre,
        responsabilidades,
        departamento: parseInt(departamentoId),
      };
      console.log("Datos enviados para actualizar:", rolActualizado);
      await updateRol(idRol, rolActualizado);
      alert("Rol actualizado");
      await ObtenerRoles();
      setEditar(false);
      limpiarFormulario();
    } catch (error) {
      alert(error.message);
    }
  };

  const eliminarRol = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este rol?")) {
      try {
        await deleteRol(id);
        alert("Rol eliminado");
        await ObtenerRoles();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const editarRol = (val) => {
    setEditar(true);
    setIdRol(val.id_rol);
    setNombre(val.nombre);
    setResponsabilidades(val.responsabilidades);
    setDepartamentoId(val.departamento_id.toString());
  };

  const limpiarFormulario = () => {
    setNombre("");
    setResponsabilidades("");
    setDepartamentoId("");
    setIdRol(null);
    setEditar(false);
  };

  return (
    <div className="container-fluid">
      {/* Header con estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Gestión de Roles</h2>
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="badge bg-primary fs-6">{roles.length}</div>
                <small className="d-block text-muted">Total</small>
              </div>
              <div className="text-center">
                <div className="badge bg-info fs-6">{departamentos.length}</div>
                <small className="d-block text-muted">Departamentos</small>
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
                {editar ? "✏️ Editar Rol" : "➕ Nuevo Rol"}
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">🏢 ID Departamento</label>
                  <input 
                    type="number" 
                    value={departamentoId} 
                    onChange={(e) => setDepartamentoId(e.target.value)} 
                    className="form-control" 
                    placeholder="Ingresa el ID del departamento"
                    min="1"
                    required
                  />

                  {departamentoId && (
                    <div className="mt-2">
                      <span className="badge bg-info">
                        Departamento: {getNombreDepartamento(parseInt(departamentoId))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Nombre del Rol</label>
                  <input 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    className="form-control" 
                    placeholder="ej: Coordinador de sistemas"
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">📋 Responsabilidades</label>
                  <textarea 
                    value={responsabilidades} 
                    onChange={(e) => setResponsabilidades(e.target.value)} 
                    className="form-control"
                    placeholder="Describe las responsabilidades del rol..."
                    rows="4"
                    required
                  />
                </div>
              </form>
            </div>
            
            <div className="card-footer">
              {editar ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-warning" onClick={actualizarRol}>
                    Actualizar Rol
                  </button>
                  <button className="btn btn-outline-secondary" onClick={limpiarFormulario}>
                    ❌ Cancelar
                  </button>
                </div>
              ) : (
                <div className="d-grid">
                  <button className="btn btn-success" onClick={crearRol}>
                    ➕ Crear Rol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de roles */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">📊 Lista de Roles</h5>
                </div>
                <div className="col-md-6">
                  <div className="row g-2">
                    <div className="col-md-7">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">🔍</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar rol..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <select
                        className="form-select form-select-sm"
                        value={filterDepartamento}
                        onChange={(e) => setFilterDepartamento(e.target.value)}
                      >
                        <option value="todos">Todos los departamentos</option>
                        {departamentos.map((dept) => (
                          <option key={dept.id_departamento} value={dept.id_departamento}>
                            {dept.nombre}
                          </option>
                        ))}
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
                        onClick={() => handleSort('id_rol')}
                      >
                        # {getSortIcon('id_rol')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('nombre')}
                      >
                        Nombre {getSortIcon('nombre')}
                      </th>
                      <th 
                        style={{cursor: 'pointer'}} 
                        onClick={() => handleSort('departamento_id')}
                      >
                       Departamento {getSortIcon('departamento_id')}
                      </th>
                      <th>📋 Responsabilidades</th>
                      <th>⚙️ Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoles.map((val) => (
                      <tr key={val.id_rol}>
                        <td><span className="badge bg-light text-dark">{val.id_rol}</span></td>
                        <td><strong>{val.nombre}</strong></td>
                        <td>
                          <div>
                            <span className="badge bg-info text-dark">
                              {getNombreDepartamento(val.departamento_id)}
                            </span>
                            <br />
                            <small className="text-muted">ID: {val.departamento_id}</small>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted" title={val.responsabilidades}>
                            {val.responsabilidades.length > 80 
                              ? val.responsabilidades.substring(0, 80) + "..." 
                              : val.responsabilidades}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => editarRol(val)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => eliminarRol(val.id_rol)}
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

              {filteredRoles.length === 0 && (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <h5>No se encontraron roles</h5>
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
                    Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRoles.length)} de {filteredRoles.length} roles
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