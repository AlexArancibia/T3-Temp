export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>TODO:</strong> Implementar página de "Análisis" para
              traders.
              <br />
              Esta página debe mostrar análisis detallado del rendimiento.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Análisis de Rendimiento
        </h1>
        <p className="text-gray-600">
          Esta funcionalidad está pendiente de implementación. Aquí se
          mostrarán:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• Dashboard con KPIs principales</li>
          <li>• Gráficos de equity curve y drawdown</li>
          <li>• Análisis por símbolo y estrategia</li>
          <li>• Risk metrics (Sharpe ratio, Calmar ratio, etc.)</li>
          <li>• Distribución de P&L</li>
          <li>• Comparación con benchmarks</li>
          <li>• Reportes personalizables</li>
        </ul>
      </div>
    </div>
  );
}
