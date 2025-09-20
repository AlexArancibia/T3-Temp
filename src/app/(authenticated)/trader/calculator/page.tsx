"use client";

import { TradingCalculator } from "@/components/trader/TradingCalculator";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Calculadora de Trading
        </h1>
        <p className="text-gray-600 mt-1">
          Herramientas avanzadas para cálculo de capital, lotaje y gestión de
          riesgo
        </p>
      </div>

      {/* Calculator Component */}
      <TradingCalculator />
    </div>
  );
}
