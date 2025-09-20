"use client";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Cable,
  Check,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateTradingAccountDialog } from "@/components/trader/CreateTradingAccountDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

interface CreateConnectionForm {
  propfirmAccountId: string;
  brokerAccountId: string;
  autoCopyEnabled: boolean;
  maxRiskPerTrade: number;
}

export default function CreateConnectionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] =
    useState(false);
  const [preselectedAccountType, setPreselectedAccountType] = useState<
    "PROPFIRM" | "BROKER" | undefined
  >(undefined);
  const [formData, setFormData] = useState<CreateConnectionForm>({
    propfirmAccountId: "",
    brokerAccountId: "",
    autoCopyEnabled: false,
    maxRiskPerTrade: 1.0,
  });

  // Real tRPC queries
  const {
    data: tradingAccounts,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = trpc.tradingAccount.getByUser.useQuery();

  const createConnection = trpc.accountLink.create.useMutation({
    onSuccess: (data) => {
      router.push(`/trader/connections/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating connection:", error.message);
      alert("Error al crear la conexión: " + error.message);
    },
  });

  const propfirmAccounts =
    tradingAccounts?.filter((acc) => acc.accountType === "PROPFIRM") || [];
  const brokerAccounts =
    tradingAccounts?.filter((acc) => acc.accountType === "BROKER") || [];

  const handleCreateAccount = (type: "PROPFIRM" | "BROKER") => {
    setPreselectedAccountType(type);
    setIsCreateAccountDialogOpen(true);
  };

  const handleAccountCreated = () => {
    refetchAccounts();
    setIsCreateAccountDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.propfirmAccountId || !formData.brokerAccountId) {
      alert("Por favor selecciona una cuenta propfirm y una cuenta broker");
      return;
    }

    if (formData.propfirmAccountId === formData.brokerAccountId) {
      alert("Las cuentas propfirm y broker deben ser diferentes");
      return;
    }

    createConnection.mutate(formData);
  };

  const steps = [
    {
      id: 1,
      title: "Seleccionar Cuentas",
      description: "Elige las cuentas a conectar",
    },
    {
      id: 2,
      title: "Configurar Parámetros",
      description: "Ajusta los settings de copy trading",
    },
    {
      id: 3,
      title: "Revisar y Crear",
      description: "Confirma la configuración",
    },
  ];

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/trader/connections">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Conexiones
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Conexión</h1>
            <p className="text-gray-600 mt-1">
              Conecta una cuenta propfirm con una cuenta broker para copy
              trading
            </p>
          </div>
        </div>
      </div>

      {/* Steps Progress */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-px mx-6 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5 p-8">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Seleccionar Cuentas
              </h3>
              <p className="text-gray-600">
                Elige la cuenta propfirm (origen) y la cuenta broker (destino)
              </p>
            </div>

            {/* Propfirm Account Selection */}
            <div>
              <Label className="text-base font-medium text-gray-900">
                Cuenta Propfirm (Origen)
              </Label>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {propfirmAccounts.length > 0 ? (
                  propfirmAccounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          propfirmAccountId: account.id,
                        }))
                      }
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.propfirmAccountId === account.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {account.accountName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {account.propfirm?.displayName || "Propfirm"} • $
                            {Number(account.currentBalance).toLocaleString()}
                          </p>
                        </div>
                        {formData.propfirmAccountId === account.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No tienes cuentas propfirm disponibles
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => handleCreateAccount("PROPFIRM")}
                    >
                      Agregar Cuenta Propfirm
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Broker Account Selection */}
            <div>
              <Label className="text-base font-medium text-gray-900">
                Cuenta Broker (Destino)
              </Label>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {brokerAccounts.length > 0 ? (
                  brokerAccounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          brokerAccountId: account.id,
                        }))
                      }
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.brokerAccountId === account.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {account.accountName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {account.broker?.displayName || "Broker"} • $
                            {Number(account.currentBalance).toLocaleString()}
                          </p>
                        </div>
                        {formData.brokerAccountId === account.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No tienes cuentas broker disponibles
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => handleCreateAccount("BROKER")}
                    >
                      Agregar Cuenta Broker
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Configurar Parámetros
              </h3>
              <p className="text-gray-600">
                Ajusta la configuración de copy trading
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label
                  htmlFor="maxRisk"
                  className="text-base font-medium text-gray-900"
                >
                  Riesgo Máximo por Operación (%)
                </Label>
                <Input
                  id="maxRisk"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={formData.maxRiskPerTrade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxRiskPerTrade: parseFloat(e.target.value) || 1.0,
                    }))
                  }
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Porcentaje máximo del balance que se puede arriesgar en una
                  operación
                </p>
              </div>

              <div>
                <Label className="text-base font-medium text-gray-900">
                  Copy Trading Automático
                </Label>
                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.autoCopyEnabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          autoCopyEnabled: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Activar copy trading automático
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Las operaciones se copiarán automáticamente desde la cuenta
                    propfirm a la cuenta broker
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Revisar Configuración
              </h3>
              <p className="text-gray-600">
                Confirma los detalles antes de crear la conexión
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Selected Accounts */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Cuentas Seleccionadas
                </h4>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Cuenta Propfirm (Origen)
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          propfirmAccounts.find(
                            (acc) => acc.id === formData.propfirmAccountId,
                          )?.accountName
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Cuenta Broker (Destino)
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          brokerAccounts.find(
                            (acc) => acc.id === formData.brokerAccountId,
                          )?.accountName
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Configuración</h4>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Riesgo Máximo por Operación:
                    </span>
                    <span className="font-medium">
                      {formData.maxRiskPerTrade}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Copy Trading Automático:
                    </span>
                    <span
                      className={`font-medium ${formData.autoCopyEnabled ? "text-emerald-600" : "text-gray-600"}`}
                    >
                      {formData.autoCopyEnabled ? "Activado" : "Desactivado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={
                currentStep === 1 &&
                (!formData.propfirmAccountId || !formData.brokerAccountId)
              }
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createConnection.isPending}
              className="bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              {createConnection.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Cable className="h-4 w-4 mr-2" />
                  Crear Conexión
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Create Account Dialog */}
      <CreateTradingAccountDialog
        isOpen={isCreateAccountDialogOpen}
        onClose={() => setIsCreateAccountDialogOpen(false)}
        onSuccess={handleAccountCreated}
        preselectedType={preselectedAccountType}
      />
    </div>
  );
}
