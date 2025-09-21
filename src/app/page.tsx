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
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const { loading } = useAuthContext();

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Permitir que usuarios autenticados vean la landing page
  // La redirección se maneja en RoleBasedRedirect para otras rutas

  const features = [
    {
      icon: <Cable className="h-6 w-6" />,
      title: "Conexiones Propfirm-Broker",
      description:
        "Sincroniza automáticamente tus cuentas de propfirm con brokers para copiar operaciones en tiempo real.",
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Calculadora Avanzada",
      description:
        "Calcula el tamaño de posición óptimo, gestión de riesgo y análisis de rendimiento integrado.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics en Tiempo Real",
      description:
        "Métricas detalladas de rendimiento, drawdown, tasa de éxito y análisis de trading profesional.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Seguridad Empresarial",
      description:
        "Protección de datos de nivel bancario con autenticación multifactor y encriptación end-to-end.",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Monitoreo 24/7",
      description:
        "Supervisión continua de tus conexiones y operaciones con alertas instantáneas en caso de problemas.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestión Multi-Usuario",
      description:
        "Sistema de roles y permisos para equipos de trading con control granular de acceso.",
    },
  ];

  const tradingFeatures = [
    {
      icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
      title: "Copia de Trading Automática",
      description:
        "Replica automáticamente las operaciones de tu cuenta propfirm en tu broker personal",
      details: [
        "Latencia ultra-baja < 50ms",
        "Sincronización bidireccional",
        "Filtros personalizables",
      ],
    },
    {
      icon: <Wallet className="h-8 w-8 text-blue-500" />,
      title: "Gestión de Cuentas",
      description:
        "Administra múltiples cuentas de propfirms y brokers desde una sola plataforma",
      details: [
        "Soporte 50+ Propfirms",
        "20+ Brokers integrados",
        "Dashboard unificado",
      ],
    },
    {
      icon: <Calculator className="h-8 w-8 text-purple-500" />,
      title: "Herramientas de Análisis",
      description:
        "Suite completa de calculadoras y métricas de rendimiento profesionales",
      details: [
        "Calculadora de posición",
        "Análisis de drawdown",
        "Métricas de Sharpe",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Trader Profesional, FTMO",
      content:
        "Esta plataforma me ha permitido escalar mi trading de manera exponencial. La sincronización es perfecta y nunca he perdido una operación.",
      rating: 5,
    },
    {
      name: "Marcus Williams",
      role: "Fund Manager, TopStep",
      content:
        "La calculadora de posición integrada me ha ahorrado horas de cálculos manuales. El ROI es increíble.",
      rating: 5,
    },
    {
      name: "Sofia Rodriguez",
      role: "Trading Coach, MyForexFunds",
      content:
        "Recomiendo esta herramienta a todos mis estudiantes. Las métricas de análisis son de nivel institucional.",
      rating: 5,
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", contactForm);
    alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.");
    setContactForm({ name: "", email: "", company: "", message: "" });
  };

  // Landing page para usuarios no autenticados
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 dark:from-gray-950 dark:via-black dark:to-gray-900 py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/20 dark:bg-cyan-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400/20 dark:bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-400/20 dark:bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-400/20 dark:bg-cyan-400/30 text-amber-100 dark:text-cyan-100 border border-amber-400/30 dark:border-cyan-400/40 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                La herramienta más avanzada para copy trading
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Multiplica tu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 dark:from-cyan-400 dark:via-purple-400 dark:to-violet-400">
                {" "}
                Capital{" "}
              </span>
              con Trading Automático
            </h1>

            <p className="text-xl text-blue-100 dark:text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Conecta tus cuentas de{" "}
              <strong className="text-amber-300 dark:text-cyan-300">
                Propfirm
              </strong>{" "}
              con tu{" "}
              <strong className="text-yellow-300 dark:text-purple-300">
                Broker personal
              </strong>{" "}
              y copia automáticamente todas las operaciones. Incluye
              calculadoras avanzadas, métricas profesionales y análisis en
              tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 text-white dark:text-white px-10 py-4 rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 dark:hover:from-cyan-400 dark:hover:to-purple-400 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Comenzar Prueba Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className="border-2 border-amber-400/50 dark:border-cyan-400/60 text-amber-200 dark:text-cyan-200 px-10 py-4 rounded-xl font-semibold hover:bg-amber-400/10 dark:hover:bg-cyan-400/20 hover:border-amber-400 dark:hover:border-cyan-400 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200 dark:text-gray-300">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-amber-300 dark:text-cyan-300" />
                Datos Encriptados
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-yellow-300 dark:text-purple-300" />
                Latencia {"<"} 50ms
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-orange-300 dark:text-violet-300" />
                50+ Propfirms Soportadas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Features Section */}
      <section
        className="py-20 bg-gradient-to-b from-orange-50 to-amber-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800"
        id="demo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-900 dark:text-gray-100 mb-4">
              ¿Cómo funciona el
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-cyan-400 dark:to-purple-400">
                {" "}
                Copy Trading{" "}
              </span>
              Automático?
            </h2>
            <p className="text-xl text-blue-700 dark:text-gray-300 max-w-3xl mx-auto">
              Nuestra plataforma conecta tus cuentas de propfirm con brokers
              personales para replicar automáticamente todas las operaciones.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {tradingFeatures.map((feature, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-gray-750 p-8 rounded-2xl border border-amber-200/30 dark:border-cyan-500/20 hover:shadow-2xl transition-all duration-300 group hover:border-amber-300 dark:hover:border-cyan-400"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-cyan-500/10 dark:to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-blue-950 dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-2xl p-8 md:p-12 border border-amber-400/20 dark:border-cyan-400/30 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Flujo de Trabajo Automático
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-400 dark:to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-amber-200 dark:text-cyan-200 font-semibold mb-2">
                  1. Conectar Propfirm
                </h4>
                <p className="text-blue-200 dark:text-gray-300 text-sm">
                  Vincula tu cuenta de propfirm (FTMO, TopStep, etc.)
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-purple-400 dark:to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-yellow-200 dark:text-purple-200 font-semibold mb-2">
                  2. Conectar Broker
                </h4>
                <p className="text-blue-200 dark:text-gray-300 text-sm">
                  Agrega tu broker personal (IC Markets, XM, etc.)
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 dark:from-violet-400 dark:to-violet-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Cable className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-orange-200 dark:text-violet-200 font-semibold mb-2">
                  3. Sincronización
                </h4>
                <p className="text-blue-200 dark:text-gray-300 text-sm">
                  Configura la conexión automática entre ambas cuentas
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 dark:from-pink-400 dark:to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-red-200 dark:text-pink-200 font-semibold mb-2">
                  4. Trading Automático
                </h4>
                <p className="text-blue-200 dark:text-gray-300 text-sm">
                  Las operaciones se copian instantáneamente
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-gray-100 mb-4">
              Funcionalidades Completas para Traders Profesionales
            </h2>
            <p className="text-xl text-blue-700 dark:text-gray-300 max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar tu trading de manera
              profesional, desde conexiones automáticas hasta análisis
              avanzados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-amber-200/50 dark:border-cyan-500/30 hover:shadow-xl hover:border-amber-400 dark:hover:border-cyan-400 transition-all duration-300 group hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-cyan-900/20 dark:hover:to-purple-900/20"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-gray-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-blue-700 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-100 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-gray-100 mb-4">
              Números que Hablan por Sí Solos
            </h2>
            <p className="text-xl text-blue-700 dark:text-gray-300">
              Confían en nosotros traders de todo el mundo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-cyan-900/20 p-8 rounded-2xl border border-amber-300/50 dark:border-cyan-400/30 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent mb-2">
                5,000+
              </div>
              <div className="text-blue-800 dark:text-gray-200 font-medium">
                Traders Activos
              </div>
              <div className="text-sm text-blue-600 dark:text-gray-400 mt-1">
                y creciendo cada día
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-2xl border border-yellow-300/50 dark:border-purple-400/30 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent mb-2">
                99.8%
              </div>
              <div className="text-blue-800 dark:text-gray-200 font-medium">
                Uptime
              </div>
              <div className="text-sm text-blue-600 dark:text-gray-400 mt-1">
                disponibilidad garantizada
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-violet-900/20 p-8 rounded-2xl border border-orange-300/50 dark:border-violet-400/30 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-violet-400 dark:to-violet-300 bg-clip-text text-transparent mb-2">
                $50M+
              </div>
              <div className="text-blue-800 dark:text-gray-200 font-medium">
                Capital Gestionado
              </div>
              <div className="text-sm text-blue-600 dark:text-gray-400 mt-1">
                a través de la plataforma
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-pink-900/20 p-8 rounded-2xl border border-red-300/50 dark:border-pink-400/30 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-pink-400 dark:to-pink-300 bg-clip-text text-transparent mb-2">
                {"<"}50ms
              </div>
              <div className="text-blue-800 dark:text-gray-200 font-medium">
                Latencia
              </div>
              <div className="text-sm text-blue-600 dark:text-gray-400 mt-1">
                ejecución ultra-rápida
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/50 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-gray-100 mb-4">
              Lo que dicen nuestros
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-cyan-400 dark:to-purple-400">
                {" "}
                Traders{" "}
              </span>
            </h2>
            <p className="text-xl text-blue-700 dark:text-gray-300">
              Testimonios reales de traders que han transformado su estrategia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-amber-50/70 dark:from-gray-800 dark:to-gray-750 p-8 rounded-2xl border border-amber-200/50 dark:border-cyan-400/30 hover:shadow-xl transition-all duration-300 hover:border-amber-400 dark:hover:border-cyan-400 shadow-lg"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-amber-500 dark:text-cyan-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-blue-800 dark:text-gray-300 mb-6 text-lg italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-blue-900 dark:text-gray-100">
                      {testimonial.name}
                    </div>
                    <div className="text-blue-600 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-20 bg-gradient-to-b from-orange-50 to-amber-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800"
        id="contact"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-blue-900 dark:text-gray-100 mb-6">
                ¿Listo para
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-cyan-400 dark:to-purple-400">
                  {" "}
                  Comenzar{" "}
                </span>
                tu Journey?
              </h2>
              <p className="text-xl text-blue-700 dark:text-gray-300 mb-8 leading-relaxed">
                Únete a miles de traders que ya están multiplicando su capital
                con nuestra plataforma de copy trading automático.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-amber-700 dark:text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-gray-100">
                      Soporte 24/7
                    </div>
                    <div className="text-blue-700 dark:text-gray-400">
                      +1 (555) 123-4567
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-yellow-700 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-gray-100">
                      Email
                    </div>
                    <div className="text-blue-700 dark:text-gray-400">
                      support@tradingplatform.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-orange-700 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-gray-100">
                      Oficina
                    </div>
                    <div className="text-blue-700 dark:text-gray-400">
                      Miami, FL - USA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-amber-200/50 dark:border-cyan-400/30 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-gray-100 mb-6">
                Contacta con Nuestro Equipo
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-blue-800 dark:text-gray-300 font-medium"
                    >
                      Nombre Completo *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Tu nombre"
                      required
                      className="mt-2 border-amber-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-blue-800 dark:text-gray-300 font-medium"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="tu@email.com"
                      required
                      className="mt-2 border-amber-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="company"
                    className="text-blue-800 dark:text-gray-300 font-medium"
                  >
                    Empresa/Propfirm
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={contactForm.company}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    placeholder="Nombre de tu empresa (opcional)"
                    className="mt-2 border-amber-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="text-blue-800 dark:text-gray-300 font-medium"
                  >
                    Mensaje *
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Cuéntanos sobre tu estrategia de trading y cómo podemos ayudarte..."
                    required
                    className="mt-2 w-full px-3 py-2 border border-amber-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 text-white py-3 rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 dark:hover:from-cyan-400 dark:hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Enviar Mensaje
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-slate-800 to-blue-950 dark:from-black dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 dark:bg-cyan-400/15 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-purple-400/15 rounded-full filter blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-400/20 dark:bg-cyan-400/30 text-amber-100 dark:text-cyan-100 border border-amber-400/30 dark:border-cyan-400/40 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Únete a la revolución del copy trading
            </span>
          </div>

          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Comienza a Multiplicar tu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 dark:from-cyan-300 dark:via-purple-300 dark:to-violet-300">
              Capital Hoy Mismo
            </span>
          </h2>

          <p className="text-xl text-blue-100 dark:text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sin riesgo. Sin compromisos. 14 días de prueba gratuita para que
            experimentes el poder del copy trading automático con todas las
            funcionalidades desbloqueadas.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 dark:hover:from-cyan-400 dark:hover:to-purple-400 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <TrendingUp className="mr-3 h-6 w-6" />
              Comenzar Prueba Gratuita
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>

            <div className="flex items-center space-x-6 text-blue-200 dark:text-gray-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-amber-300 dark:text-cyan-300 mr-2" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-orange-300 dark:text-purple-300 mr-2" />
                100% Seguro
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-blue-300 dark:text-gray-300 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/signin"
                className="text-amber-300 dark:text-cyan-300 hover:text-amber-200 dark:hover:text-cyan-200 font-semibold"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
