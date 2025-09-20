"use client";

import {
  AlertCircle,
  Building2,
  Check,
  DollarSign,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

interface CreateTradingAccountForm {
  accountName: string;
  accountType: "PROPFIRM" | "BROKER";
  accountNumber: string;
  server: string;
  propfirmId: string;
  brokerId: string;
  accountTypeId: string;
  initialBalance: number;
  currentBalance: number;
  equity: number;
  currentPhaseId: string;
  status: string;
}

interface CreateTradingAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (account: {
    id: string;
    accountName: string;
    accountType: string;
    initialBalance: number;
  }) => void;
  preselectedType?: "PROPFIRM" | "BROKER";
}

export function CreateTradingAccountDialog({
  isOpen,
  onClose,
  onSuccess,
  preselectedType,
}: CreateTradingAccountDialogProps) {
  const [formData, setFormData] = useState<CreateTradingAccountForm>({
    accountName: "",
    accountType: preselectedType || "PROPFIRM",
    accountNumber: "",
    server: "",
    propfirmId: "",
    brokerId: "",
    accountTypeId: "",
    initialBalance: 100000,
    currentBalance: 100000,
    equity: 100000,
    currentPhaseId: "",
    status: "active",
  });

  // Real tRPC queries
  const { data: propfirms } = trpc.propfirm.getAll.useQuery({});
  const { data: brokers } = trpc.broker.getAll.useQuery({});

  // Queries específicas para la propfirm seleccionada
  const { data: selectedPropfirm } = trpc.propfirm.getById.useQuery(
    { id: formData.propfirmId },
    { enabled: !!formData.propfirmId },
  );

  const createAccount = trpc.tradingAccount.create.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
      handleClose();
    },
    onError: (error) => {
      console.error("Error creating account:", error.message);
      alert("Error al crear la cuenta: " + error.message);
    },
  });

  const handleClose = () => {
    setFormData({
      accountName: "",
      accountType: preselectedType || "PROPFIRM",
      accountNumber: "",
      server: "",
      propfirmId: "",
      brokerId: "",
      accountTypeId: "",
      initialBalance: 100000,
      currentBalance: 100000,
      equity: 100000,
      currentPhaseId: "",
      status: "active",
    });
    onClose();
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.accountName.trim()) {
      alert("El nombre de la cuenta es requerido");
      return;
    }

    if (formData.initialBalance <= 0) {
      alert("El balance inicial debe ser mayor a 0");
      return;
    }

    if (formData.accountType === "PROPFIRM" && !formData.propfirmId) {
      alert("Selecciona una propfirm");
      return;
    }

    if (formData.accountType === "BROKER" && !formData.brokerId) {
      alert("Selecciona un broker");
      return;
    }

    // Preparar datos para envío
    const submitData = {
      accountName: formData.accountName,
      accountType: formData.accountType,
      accountNumber: formData.accountNumber || undefined,
      server: formData.server || undefined,
      propfirmId:
        formData.accountType === "PROPFIRM" ? formData.propfirmId : undefined,
      brokerId:
        formData.accountType === "BROKER" ? formData.brokerId : undefined,
      accountTypeId: formData.accountTypeId || undefined,
      initialBalance: formData.initialBalance,
      currentBalance: formData.currentBalance || formData.initialBalance,
      equity: formData.equity || formData.initialBalance,
      currentPhaseId: formData.currentPhaseId || undefined,
      status: formData.status,
    };

    createAccount.mutate(submitData);
  };

  const availablePropfirms = propfirms?.data || [];
  const availableBrokers = brokers?.data || [];
  const availableAccountTypes = selectedPropfirm?.accountTypes || [];
  const availablePhases = selectedPropfirm?.phases || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 bg-transparent border-0">
        {/* Simplified gradient background */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

          {/* Content */}
          <div className="relative p-6 text-white">
            {/* Minimal Header */}
            <div className="flex items-center mb-6">
              {formData.accountType === "PROPFIRM" ? (
                <Building2 className="h-6 w-6 text-blue-400 mr-3" />
              ) : (
                <Wallet className="h-6 w-6 text-emerald-400 mr-3" />
              )}
              <h2 className="text-xl font-semibold">
                Nueva Cuenta{" "}
                {formData.accountType === "PROPFIRM" ? "Propfirm" : "Broker"}
              </h2>
            </div>

            {/* Simplified Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    accountType: "PROPFIRM",
                    propfirmId: "",
                    brokerId: "",
                  }))
                }
                className={`p-4 rounded-lg border transition-all ${
                  formData.accountType === "PROPFIRM"
                    ? "border-blue-400 bg-blue-400/10 text-blue-400"
                    : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span className="font-medium">Propfirm</span>
                </div>
              </button>

              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    accountType: "BROKER",
                    propfirmId: "",
                    brokerId: "",
                  }))
                }
                className={`p-4 rounded-lg border transition-all ${
                  formData.accountType === "BROKER"
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                    : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  <span className="font-medium">Broker</span>
                </div>
              </button>
            </div>

            {/* Simplified form content */}
            <div className="max-h-[450px] overflow-y-auto space-y-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="accountName"
                    className="text-slate-200 text-sm"
                  >
                    Nombre *
                  </Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountName: e.target.value,
                      }))
                    }
                    placeholder="Mi Cuenta FTMO"
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="accountNumber"
                      className="text-slate-200 text-sm"
                    >
                      Número de Cuenta
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      placeholder="51234567"
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="server" className="text-slate-200 text-sm">
                      Servidor
                    </Label>
                    <Input
                      id="server"
                      value={formData.server}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          server: e.target.value,
                        }))
                      }
                      placeholder="FTMO-Server1"
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Provider Selection */}
              <div className="space-y-4">
                {formData.accountType === "PROPFIRM" ? (
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="propfirm"
                        className="text-slate-200 text-sm"
                      >
                        Propfirm *
                      </Label>
                      <select
                        id="propfirm"
                        value={formData.propfirmId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            propfirmId: e.target.value,
                            accountTypeId: "",
                            currentPhaseId: "",
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-slate-500 focus:outline-none"
                      >
                        <option value="" className="bg-slate-800">
                          Selecciona una propfirm
                        </option>
                        {availablePropfirms.map((propfirm) => (
                          <option
                            key={propfirm.id}
                            value={propfirm.id}
                            className="bg-slate-800"
                          >
                            {propfirm.displayName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.propfirmId && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="accountType"
                            className="text-slate-200 text-sm"
                          >
                            Tipo de Cuenta
                          </Label>
                          <select
                            id="accountType"
                            value={formData.accountTypeId}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                accountTypeId: e.target.value,
                              }))
                            }
                            className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-slate-500 focus:outline-none"
                          >
                            <option value="" className="bg-slate-800">
                              Selecciona el tipo
                            </option>
                            {availableAccountTypes.map((type) => (
                              <option
                                key={type.id}
                                value={type.id}
                                className="bg-slate-800"
                              >
                                {type.displayName} - $
                                {Number(type.initialBalance).toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label
                            htmlFor="phase"
                            className="text-slate-200 text-sm"
                          >
                            Fase Actual
                          </Label>
                          <select
                            id="phase"
                            value={formData.currentPhaseId}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                currentPhaseId: e.target.value,
                              }))
                            }
                            className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-slate-500 focus:outline-none"
                          >
                            <option value="" className="bg-slate-800">
                              Selecciona la fase
                            </option>
                            {availablePhases.map((phase) => (
                              <option
                                key={phase.id}
                                value={phase.id}
                                className="bg-slate-800"
                              >
                                {phase.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="broker" className="text-slate-200 text-sm">
                      Broker *
                    </Label>
                    <select
                      id="broker"
                      value={formData.brokerId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          brokerId: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-slate-500 focus:outline-none"
                    >
                      <option value="" className="bg-slate-800">
                        Selecciona un broker
                      </option>
                      {availableBrokers.map((broker) => (
                        <option
                          key={broker.id}
                          value={broker.id}
                          className="bg-slate-800"
                        >
                          {broker.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Balance Configuration */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="initialBalance"
                    className="text-slate-200 text-sm"
                  >
                    Balance Inicial * (USD)
                  </Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.initialBalance}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        initialBalance: value,
                        currentBalance: value,
                        equity: value,
                      }));
                    }}
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-slate-200 text-sm">
                    Estado
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-slate-500 focus:outline-none"
                  >
                    <option value="active" className="bg-slate-800">
                      Activa
                    </option>
                    <option value="inactive" className="bg-slate-800">
                      Inactiva
                    </option>
                    <option value="warning" className="bg-slate-800">
                      Advertencia
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Simplified Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={
                  createAccount.isPending ||
                  !formData.accountName ||
                  (formData.accountType === "PROPFIRM" &&
                    !formData.propfirmId) ||
                  (formData.accountType === "BROKER" && !formData.brokerId) ||
                  formData.initialBalance <= 0
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {createAccount.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
