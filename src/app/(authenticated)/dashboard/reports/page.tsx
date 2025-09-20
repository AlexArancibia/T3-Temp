export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>TODO:</strong> Implementar página de "Reportes" para
              viewers.
              <br />
              Esta página debe mostrar reportes de solo lectura.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Reportes del Sistema
        </h1>
        <p className="text-gray-600">
          Esta funcionalidad está pendiente de implementación. Aquí se
          mostrarán:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• Reportes predefinidos del sistema</li>
          <li>• Visualización de datos agregados</li>
          <li>• Filtros temporales</li>
          <li>• Gráficos y métricas de solo lectura</li>
          <li>• Exportación de reportes</li>
          <li>• Programación de reportes automáticos</li>
        </ul>
      </div>
    </div>
  );
}
