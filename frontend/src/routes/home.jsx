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
    <Container className="py-8 px-4 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gestión de Recursos Tecnológicos
        </h1>
        <p className="text-gray-600 mb-4">
          La aplicación web está diseñada para optimizar la administración del área de Tecnología, gestionando de manera eficiente la estructura jerárquica, roles, departamentos y responsabilidades del personal. Facilita los procesos de recursos humanos y la asignación de funciones técnicas y operativas.
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Funcionalidades Clave</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Gestión de Empleados</strong>: Crear, editar y eliminar perfiles de empleados con información detallada.</li>
          <li><strong>Organización de Departamentos</strong>: Asignar empleados a departamentos y visualizar jerarquías en tiempo real.</li>
          <li><strong>Gestión de Roles</strong>: Configurar roles con permisos personalizados para un control preciso.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Beneficios</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Eficiencia Operativa</strong>: Automatiza procesos, reduciendo tiempos y errores.</li>
          <li><strong>Toma de Decisiones</strong>: Proporciona datos claros para una planificación efectiva.</li>
          <li><strong>Escalabilidad</strong>: Se adapta al crecimiento del área de Tecnología.</li>
        </ul>
        <p className="text-gray-600">
          La aplicación ofrece una interfaz intuitiva, con la capacidad de que esa escalable y agregar nuevas funcionalidades, ideal para administradores que buscan optimizar la gestión de recursos humanos. Explore esta herramienta para transformar la administración del área de Tecnología.
        </p>
      </div>
    </Container>
  );
}