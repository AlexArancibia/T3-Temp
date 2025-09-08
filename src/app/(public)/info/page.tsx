"use client";

import { Award, Clock, Globe, Info, Target, Users } from "lucide-react";

export default function InfoPage() {
  const companyInfo = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Nuestra Misión",
      description:
        "Democratizar el acceso a herramientas de productividad de clase mundial, permitiendo que cualquier persona o empresa pueda alcanzar su máximo potencial.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Nuestra Visión",
      description:
        "Ser la plataforma líder global que conecta equipos, optimiza procesos y acelera la innovación en todas las industrias.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Nuestros Valores",
      description:
        "Innovación constante, transparencia total, excelencia en el servicio al cliente y compromiso con la privacidad y seguridad de los datos.",
    },
  ];

  const teamMembers = [
    {
      name: "María González",
      role: "CEO & Fundadora",
      description:
        "15 años de experiencia en tecnología y liderazgo empresarial.",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Carlos Ruiz",
      role: "CTO",
      description:
        "Experto en arquitectura de software y desarrollo de productos escalables.",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Ana Martínez",
      role: "Directora de Producto",
      description:
        "Especialista en experiencia de usuario y estrategia de producto.",
      image: "/api/placeholder/150/150",
    },
    {
      name: "David López",
      role: "Director de Marketing",
      description:
        "Experto en crecimiento y marketing digital con más de 10 años de experiencia.",
      image: "/api/placeholder/150/150",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Fundación",
      description:
        "Nacimos con la visión de revolucionar la productividad empresarial.",
    },
    {
      year: "2021",
      title: "Primer Cliente",
      description:
        "Lanzamos nuestra plataforma con nuestro primer cliente empresarial.",
    },
    {
      year: "2022",
      title: "Expansión",
      description:
        "Crecimos a 1,000 usuarios activos y lanzamos nuevas funcionalidades.",
    },
    {
      year: "2023",
      title: "Internacionalización",
      description: "Expandimos nuestros servicios a 15 países diferentes.",
    },
    {
      year: "2024",
      title: "Innovación",
      description:
        "Lanzamos IA integrada y alcanzamos los 10,000 usuarios activos.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
              <Info className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Acerca de Nosotros
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos un equipo apasionado por la tecnología y la innovación,
              dedicados a crear soluciones que transformen la forma en que
              trabajas.
            </p>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {companyInfo.map((info, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {info.title}
                </h3>
                <p className="text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Viaje
            </h2>
            <p className="text-xl text-gray-600">
              Desde nuestros humildes comienzos hasta convertirnos en líderes de
              la industria
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600">
              Conoce a las personas detrás de nuestra innovación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Números que Hablan
            </h2>
            <p className="text-xl text-blue-100">
              El impacto de nuestro trabajo en números
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Usuarios Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Países</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Satisfacción</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Tienes Preguntas?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes
            posible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contacto@miapp.com"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contactar por Email
            </a>
            <a
              href="/contact"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Formulario de Contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
