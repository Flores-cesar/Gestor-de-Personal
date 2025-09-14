import Container from 'react-bootstrap/Container';
import { useEffect } from 'react';

export default function Description() {
  // añadir Tailwind CSS via CDN dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Container className="py-0.5 px-4 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gestión de Recursos Tecnológicos
        </h1>
        <p className="text-gray-600 mb-4">
          La aplicación web está diseñada para optimizar la administración del área de Tecnología, gestionando de manera eficiente la estructura jerárquica, roles, departamentos y responsabilidades del personal. Facilita los procesos de recursos humanos y la asignación de funciones técnicas y operativas.
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Funcionalidades Clave</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Gestión de Departamentos</strong>: Crear, editar y eliminar departamentos con estructura jerárquica que permite definir departamentos padre e hijos (subdepartamentos), asignando responsables y organizando la empresa de forma escalable.</li>
          <li><strong>Gestión de Roles</strong>: Configurar múltiples roles específicos para cada departamento con responsabilidades personalizadas. Cada rol puede ser asignado a varios empleados según las necesidades operativas del departamento.</li>
          <li><strong>Gestión de Empleados</strong>: Crear, editar y eliminar perfiles de empleados con información detallada, asignándoles roles específicos y gestionando diferentes estados (activo, inactivo, suspendido, baja).</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Consideraciones y Restricciones del Sistema</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Integridad Departamental</strong>: Los departamentos pueden formar jerarquías multinivel. Si se elimina un departamento padre, los subdepartamentos mantienen su integridad.</li>
          <li><strong>Roles por Departamento</strong>: Cada rol está vinculado a un departamento específico y no puede existir sin él. La eliminación de un departamento elimina automáticamente todos sus roles asociados.</li>
          <li><strong>Asignación de Empleados</strong>: Los empleados deben tener un rol asignado obligatoriamente. No se permite eliminar un rol si tiene empleados asignados (restricción de integridad).</li>
          <li><strong>Estados de Empleados</strong>: El sistema controla cuatro estados: activo, inactivo, suspendido y baja, permitiendo un seguimiento preciso del personal.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Beneficios</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Eficiencia Operativa</strong>: Automatiza procesos, reduciendo tiempos y errores en la gestión jerárquica.</li>
          <li><strong>Toma de Decisiones</strong>: Proporciona datos claros sobre la estructura organizacional para una planificación efectiva.</li>
          <li><strong>Escalabilidad</strong>: Se adapta al crecimiento del área de Tecnología manteniendo la integridad de la estructura jerárquica.</li>
          <li><strong>Control de Integridad</strong>: Garantiza consistencia en las relaciones entre departamentos, roles y empleados.</li>
        </ul>
        <p className="text-gray-600">
          La aplicación ofrece una interfaz intuitiva con capacidad de escalabilidad y adición de nuevas funcionalidades. Es ideal para administradores que buscan optimizar la gestión de recursos humanos con control total sobre la estructura organizacional.
        </p>
      </div>
    </Container>
  );
}