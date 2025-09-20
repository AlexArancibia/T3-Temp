"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Cable,
  Calculator,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      period: "/mes",
      description: "Perfecto para traders individuales que están comenzando",
      features: [
        "1 Conexión Propfirm-Broker",
        "Hasta 2 cuentas de trading",
        "Calculadora básica",
        "Soporte por email",
        "Dashboard básico",
        "Métricas esenciales",
        "Sincronización manual",
        "Reportes básicos",
      ],
      buttonText: "Comenzar Gratis",
      popular: false,
      color: "border-gray-200",
      bgColor: "bg-white",
    },
    {
      name: "Professional",
      price: "$149",
      period: "/mes",
      description: "Para traders serios que necesitan múltiples conexiones",
      features: [
        "5 Conexiones Propfirm-Broker",
        "Hasta 10 cuentas de trading",
        "Suite completa de calculadoras",
        "Soporte prioritario 24/7",
        "Analytics avanzados",
        "Alertas en tiempo real",
        "API access",
        "Exportación de datos",
        "Filtros avanzados",
        "Copiar configuraciones",
        "Reportes detallados",
        "Integración webhook",
      ],
      buttonText: "Prueba Gratuita 14 días",
      popular: true,
      color: "border-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    },
    {
      name: "Enterprise",
      price: "$499",
      period: "/mes",
      description: "Solución completa para equipos y prop firms",
      features: [
        "Conexiones ilimitadas",
        "Cuentas ilimitadas",
        "Gestión de equipos",
        "Soporte dedicado",
        "Analytics institucionales",
        "White-label disponible",
        "SLA garantizado 99.9%",
        "Integración personalizada",
        "Onboarding dedicado",
        "Manager de cuentas",
        "Backup automático",
        "Auditoría completa",
        "SSO (Single Sign-On)",
        "Compliance reporting",
      ],
      buttonText: "Contactar Ventas",
      popular: false,
      color: "border-purple-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
  ];

  const features = [
    {
      icon: <Cable className="h-8 w-8 text-blue-500" />,
      title: "Copy Trading Automático",
      description:
        "Sincronización en tiempo real entre propfirm y broker con latencia ultra-baja.",
    },
    {
      icon: <Calculator className="h-8 w-8 text-emerald-500" />,
      title: "Calculadoras Avanzadas",
      description:
        "Gestión de riesgo, tamaño de posición y análisis de rendimiento integrado.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Analytics Profesionales",
      description:
        "Métricas detalladas como Sharpe ratio, drawdown y tasa de éxito.",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Seguridad Bancaria",
      description:
        "Encriptación end-to-end y autenticación de múltiples factores.",
    },
  ];

  const faqs = [
    {
      question: "¿Cómo funciona la prueba gratuita?",
      answer:
        "Obtienes acceso completo al plan Professional durante 14 días sin necesidad de tarjeta de crédito. Puedes cancelar en cualquier momento.",
    },
    {
      question: "¿Qué propfirms y brokers soportan?",
      answer:
        "Soportamos más de 50 propfirms incluyendo FTMO, TopStep, MyForexFunds y 20+ brokers como IC Markets, XM, Pepperstone, entre otros.",
    },
    {
      question: "¿Cuál es la latencia de copia?",
      answer:
        "Nuestra tecnología garantiza una latencia promedio de menos de 50ms para la replicación de operaciones.",
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer:
        "Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se reflejan inmediatamente en tu facturación.",
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer:
        "Todos los planes incluyen soporte por email. Professional y Enterprise incluyen soporte prioritario 24/7 y chat en vivo.",
    },
    {
      question: "¿Hay descuentos por pago anual?",
      answer:
        "Sí, ofrecemos un 20% de descuento en todos los planes si pagas anualmente. Contacta a ventas para más detalles.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <TrendingUp className="w-4 h-4 mr-2" />
              Planes flexibles para todos los traders
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Precios Transparentes,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              {" "}
              Resultados Garantizados{" "}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comienza gratis y escala cuando estés listo. Sin contratos, sin
            sorpresas. Solo las herramientas que necesitas para multiplicar tu
            capital.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              14 días gratis en Professional
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-500" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-purple-500" />
              Cancela cuando quieras
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative ${plan.bgColor} rounded-2xl border-2 ${plan.color} p-8 ${
                  plan.popular ? "scale-105 shadow-2xl" : "shadow-lg"
                } transition-all duration-300 hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que Necesitas para Trading Profesional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas avanzadas que te ayudan a gestionar, analizar y
              optimizar tu trading.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos las dudas más comunes sobre nuestros planes
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Sales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas un Plan Personalizado?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Para equipos grandes, propfirms o necesidades especiales, creamos
              una solución a medida.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center text-blue-100">
                <Phone className="w-5 h-5 mr-2" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-blue-100">
                <Mail className="w-5 h-5 mr-2" />
                sales@tradingplatform.com
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/#contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Contactar Ventas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Comienza Tu Journey de Trading Hoy
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Miles de traders ya están usando nuestra plataforma para multiplicar
            su capital.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Comenzar Prueba Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
