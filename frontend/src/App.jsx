import './App.css'
import { useState } from "react"
import Axios from "axios"

function App() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState(0);
  const [rol, setRol] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [salario, setSalario] = useState(0);
  const [estado, setEstado] = useState("activo");
  const [empleados, setEmpleados] = useState([]);
  
  const agregarEmpleado = ()=>{
    Axios.post("http://127.0.0.1:8000/api/empleados/create/",{

    nombre: nombre,
    apellido: apellido,
    id_rol: rol,
    fecha_ingreso: fechaIngreso,
    salario: salario,
    edad: edad
    }).then(()=> {alert("Empleado registrado")})
  }

  const listarEmpleados = ()=>{
    Axios.get("http://127.0.0.1:8000/api/empleados/list").then ((response)=>{
      setEmpleados(response.data.empleados);

    })
  }

  return (
    <div className="App">
      <div className="datos">
        <label>Nombre: <input onChange={(event) => {
          setNombre(event.target.value)
        }}
         type="text"></input></label>

        <label>Apellido: <input onChange={(event) => {
          setApellido(event.target.value)
        }} type="text"></input></label>

        <label>Edad: <input onChange={(event) => {
          setEdad(parseInt(event.target.value) || 0)
        }} type="number"></input></label>

        <label>Rol: <input onChange={(event) => {
          setRol(event.target.value)
        }} type="text"></input></label>
        <label>Fecha de ingreso: <input onChange={(event) => {
          setFechaIngreso(event.target.value)
        }} type="date"></input></label>

        <label>salario: <input onChange={(event) => {
          setSalario(event.target.value)
        }} type="number"></input></label>

        <label>Estado: 
          <select onChange={(event) => {
            setEstado(event.target.value)
          }}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
            <option value="baja">Baja</option>
          </select>
        </label>

        <button onClick={agregarEmpleado}>Guardar</button>
        <button onClick={listarEmpleados}>listar Empleados</button>
        {
          empleados.map((val,key) => {
            return <div className=''>{val.nombre}</div>
          }) 
        }


      </div>
    </div>
  )
}
export default App