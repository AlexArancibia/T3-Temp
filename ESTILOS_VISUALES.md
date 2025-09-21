# 🎨 Guía de Estilos Visuales - Feniz Trading Platform

## 📋 Índice
- [Tipografía](#tipografía)
- [Esquema de Colores](#esquema-de-colores)
- [Componentes de Botones](#componentes-de-botones)
- [Tarjetas y Contenedores](#tarjetas-y-contenedores)
- [Navegación](#navegación)
- [Estados y Feedback](#estados-y-feedback)
- [Responsive Design](#responsive-design)
- [Temas](#temas)

---

## 📝 Tipografía

### **Títulos Principales**
```css
/* Título Principal - Páginas */
h1 {
  font-size: 3rem;        /* text-3xl */
  font-weight: 600;       /* font-semibold */
  color: #111827;         /* text-gray-900 */
}

/* Responsive */
@media (min-width: 768px) {
  h1 {
    font-size: 4rem;      /* md:text-4xl */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 5rem;      /* lg:text-5xl */
  }
}
```

### **Subtítulos**
```css
/* Subtítulos de Sección */
h2 {
  font-size: 1.5rem;      /* text-xl */
  font-weight: 600;       /* font-semibold */
  color: #111827;         /* text-gray-900 */
  margin-bottom: 1rem;    /* mb-4 */
}

/* Subtítulos de Tarjetas */
h3 {
  font-size: 1.125rem;    /* text-lg */
  font-weight: 600;       /* font-semibold */
  color: #111827;         /* text-gray-900 */
}
```

### **Texto de Cuerpo**
```css
/* Texto Principal */
.text-body {
  font-size: 1rem;        /* text-base */
  color: #6b7280;         /* text-gray-600 */
  line-height: 1.5;       /* leading-relaxed */
}

/* Texto Secundario */
.text-muted {
  font-size: 0.875rem;    /* text-sm */
  color: #9ca3af;         /* text-gray-400 */
}

/* Texto Pequeño */
.text-xs {
  font-size: 0.75rem;     /* text-xs */
  color: #6b7280;         /* text-gray-500 */
}
```

### **Fuente Principal**
```css
/* Familia de Fuente */
body {
  font-family: "Poppins", sans-serif;
}
```

---

## 🎨 Esquema de Colores

### **Colores Primarios**
```css
/* Amarillo/Dorado Principal */
--color-primary: hsl(42, 91%, 58%);           /* #F5BA35 */
--color-primary-foreground: hsl(0 0% 98%);    /* Blanco */

/* Azul Secundario */
--color-blue-600: #2563eb;
--color-blue-700: #1d4ed8;
--color-blue-500: #3b82f6;
```

### **Colores de Estado**
```css
/* Éxito/Positivo */
--color-success: #10b981;      /* emerald-500 */
--color-success-bg: #d1fae5;   /* emerald-100 */
--color-success-text: #065f46; /* emerald-800 */

/* Error/Destructivo */
--color-destructive: #ef4444;  /* red-500 */
--color-destructive-bg: #fee2e2; /* red-100 */
--color-destructive-text: #991b1b; /* red-800 */

/* Advertencia */
--color-warning: #f59e0b;      /* amber-500 */
--color-warning-bg: #fef3c7;   /* amber-100 */
--color-warning-text: #92400e; /* amber-800 */

/* Información */
--color-info: #3b82f6;         /* blue-500 */
--color-info-bg: #dbeafe;      /* blue-100 */
--color-info-text: #1e40af;    /* blue-800 */
```

### **Colores Neutros**
```css
/* Grises */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
```

### **Colores de Fondo**
```css
/* Light Mode */
--color-background: hsl(0 0% 100%);           /* Blanco */
--color-card: hsl(0 0% 100%);                 /* Blanco */
--color-border: hsl(240 5.9% 95%);            /* Gris claro */

/* Dark Mode */
--color-background: hsl(220 19% 15%);         /* Gris oscuro */
--color-card: hsl(240 10% 3.9%);              /* Casi negro */
--color-border: hsl(240 3.7% 25%);            /* Gris medio */
```

---

## 🔘 Componentes de Botones

### **Botón Primario (Default)**
```css
.btn-primary {
  background-color: var(--color-primary);     /* #F5BA35 */
  color: var(--color-primary-foreground);     /* Blanco */
  padding: 0.5rem 1rem;                       /* px-4 py-2 */
  border-radius: 0.375rem;                    /* rounded-md */
  font-weight: 500;                           /* font-medium */
  font-size: 0.875rem;                        /* text-sm */
  transition: all 0.2s;                       /* transition-all */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-xs */
}

.btn-primary:hover {
  background-color: rgba(245, 186, 53, 0.9); /* primary/90 */
}
```

### **Botón Secundario (Outline)**
```css
.btn-outline {
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-foreground);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}
```

### **Botón Destructivo**
```css
.btn-destructive {
  background-color: var(--color-destructive);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-destructive:hover {
  background-color: rgba(239, 68, 68, 0.9); /* destructive/90 */
}
```

### **Botón Fantasma (Ghost)**
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-foreground);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}
```

### **Tamaños de Botones**
```css
/* Botón Pequeño */
.btn-sm {
  height: 2rem;           /* h-8 */
  padding: 0.375rem 0.75rem; /* px-3 */
  font-size: 0.75rem;     /* text-xs */
  border-radius: 0.375rem;
}

/* Botón Estándar */
.btn-default {
  height: 2.25rem;        /* h-9 */
  padding: 0.5rem 1rem;   /* px-4 py-2 */
  font-size: 0.875rem;    /* text-sm */
  border-radius: 0.375rem;
}

/* Botón Grande */
.btn-lg {
  height: 2.5rem;         /* h-10 */
  padding: 0.5rem 1.5rem; /* px-6 */
  font-size: 1rem;        /* text-base */
  border-radius: 0.375rem;
}

/* Botón Icono */
.btn-icon {
  width: 2.25rem;         /* w-9 */
  height: 2.25rem;        /* h-9 */
  padding: 0;
}
```

---

## 🃏 Tarjetas y Contenedores

### **Tarjeta Estándar**
```css
.card {
  background-color: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;        /* rounded-xl */
  padding: 1.5rem;               /* p-6 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-sm */
}

/* Tarjeta con Sombra Elevada */
.card-elevated {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
}
```

### **Tarjeta de Estadísticas**
```css
.stat-card {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;           /* rounded-2xl */
  padding: 1.5rem;               /* p-6 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.stat-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s;
}
```

### **Contenedor con Gradiente**
```css
.gradient-card {
  background: linear-gradient(135deg, #3b82f6, #6366f1); /* from-blue-500 to-indigo-600 */
  color: white;
  border-radius: 1rem;           /* rounded-2xl */
  padding: 1.5rem;               /* p-6 */
}
```

### **Contenedor con Backdrop Blur**
```css
.backdrop-card {
  background-color: rgba(255, 255, 255, 0.7); /* bg-white/70 */
  backdrop-filter: blur(8px);    /* backdrop-blur-sm */
  border: 1px solid rgba(229, 231, 235, 0.5); /* border-gray-200/50 */
  border-radius: 1rem;           /* rounded-2xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

---

## 🧭 Navegación

### **Navbar Global (Siempre Dark)**
```css
.global-navbar {
  background-color: #20252F;     /* bg-[#20252F] */
  border-bottom: 1px solid #374151; /* border-gray-700 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-lg */
  height: 4rem;                  /* h-16 */
}

.navbar-logo {
  background: linear-gradient(to right, #F5BA35, #f97316); /* from-[#F5BA35] to-orange-500 */
  color: white;
  border-radius: 0.5rem;         /* rounded-lg */
  width: 2rem;                   /* w-8 */
  height: 2rem;                  /* h-8 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;           /* text-sm */
}

.navbar-link {
  color: #d1d5db;                /* text-gray-300 */
  transition: color 0.2s;
}

.navbar-link:hover {
  color: #ffffff;                /* text-white */
}
```

### **Sidebar de Trader**
```css
.trader-sidebar {
  width: 18rem;                  /* w-72 */
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.sidebar-header {
  padding: 1.5rem;               /* p-6 */
  border-bottom: 1px solid var(--color-border);
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;         /* px-5 py-4 */
  margin: 0.75rem 0;             /* space-y-3 */
  border-radius: 0.75rem;        /* rounded-xl */
  font-size: 0.875rem;           /* text-sm */
  font-weight: 500;              /* font-medium */
  color: var(--color-card-foreground);
  transition: all 0.2s;
}

.sidebar-nav-item:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}

.sidebar-nav-item.active {
  background-color: rgba(245, 186, 53, 0.2); /* bg-primary/20 */
}
```

---

## 🎯 Estados y Feedback

### **Estados de Conexión**
```css
/* Estado Activo */
.status-active {
  background-color: #d1fae5;     /* bg-emerald-100 */
  color: #065f46;                /* text-emerald-800 */
}

.status-active-dot {
  background-color: #10b981;     /* bg-emerald-500 */
  width: 0.5rem;                 /* w-2 */
  height: 0.5rem;                /* h-2 */
  border-radius: 50%;            /* rounded-full */
}

/* Estado Inactivo */
.status-inactive {
  background-color: #fed7aa;     /* bg-orange-100 */
  color: #9a3412;                /* text-orange-800 */
}

.status-inactive-dot {
  background-color: #f97316;     /* bg-orange-500 */
}

/* Estado Error */
.status-error {
  background-color: #fee2e2;     /* bg-red-100 */
  color: #991b1b;                /* text-red-800 */
}

.status-error-dot {
  background-color: #ef4444;     /* bg-red-500 */
}
```

### **Estados de P&L**
```css
/* P&L Positivo */
.pnl-positive {
  color: #059669;                /* text-green-600 */
}

.pnl-positive-bg {
  background-color: #10b981;     /* bg-green-500 */
}

/* P&L Negativo */
.pnl-negative {
  color: #dc2626;                /* text-red-600 */
}

.pnl-negative-bg {
  background-color: #ef4444;     /* bg-red-500 */
}

/* Dark Mode P&L */
.dark .pnl-positive {
  color: #34d399;                /* text-green-400 */
}

.dark .pnl-negative {
  color: #f87171;                /* text-red-400 */
}
```

### **Estados de Carga**
```css
.loading-spinner {
  width: 3rem;                   /* w-12 */
  height: 3rem;                  /* h-12 */
  border: 2px solid transparent;
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Design

### **Breakpoints**
```css
/* Mobile First */
@media (min-width: 640px) {  /* sm: */
  .container { max-width: 640px; }
}

@media (min-width: 768px) {  /* md: */
  .container { max-width: 768px; }
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) { /* lg: */
  .container { max-width: 1024px; }
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1280px) { /* xl: */
  .container { max-width: 1280px; }
}
```

### **Grid System**
```css
/* Grid de Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Grid de Contenido Principal */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 2fr 1fr;
  }
}
```

### **Espaciado Responsive**
```css
/* Espaciado de Sección */
.section-spacing {
  padding-top: 5rem;             /* py-20 */
  padding-bottom: 5rem;
}

@media (min-width: 768px) {
  .section-spacing {
    padding-top: 6rem;           /* md:py-24 */
    padding-bottom: 6rem;
  }
}

/* Padding de Contenedor */
.container-padding {
  padding-left: 1rem;            /* px-4 */
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-padding {
    padding-left: 1.5rem;        /* sm:px-6 */
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-padding {
    padding-left: 2rem;          /* lg:px-8 */
    padding-right: 2rem;
  }
}
```

---

## 🌙 Temas

### **Light Theme**
```css
:root {
  --color-background: #ffffff;
  --color-foreground: #111827;
  --color-card: #ffffff;
  --color-card-foreground: #111827;
  --color-border: #e5e7eb;
  --color-muted: #f3f4f6;
  --color-muted-foreground: #6b7280;
}
```

### **Dark Theme**
```css
.dark {
  --color-background: hsl(220 19% 15%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(240 10% 3.9%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-border: hsl(240 3.7% 25%);
  --color-muted: hsl(240 3.7% 15.9%);
  --color-muted-foreground: hsl(240 5% 64.9%);
}
```

### **Transiciones de Tema**
```css
* {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}
```

---

## 🎨 Iconos y Elementos Visuales

### **Iconos de Estado**
```css
.icon-container {
  width: 3rem;                   /* w-12 */
  height: 3rem;                  /* h-12 */
  border-radius: 0.75rem;        /* rounded-xl */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-primary {
  background-color: var(--color-primary);
}

.icon-success {
  background-color: #10b981;     /* bg-emerald-500 */
}

.icon-error {
  background-color: #ef4444;     /* bg-red-500 */
}

.icon-info {
  background-color: #3b82f6;     /* bg-blue-500 */
}

.icon-warning {
  background-color: #f59e0b;     /* bg-amber-500 */
}
```

### **Badges y Etiquetas**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;       /* px-2 py-1 */
  font-size: 0.75rem;            /* text-xs */
  font-weight: 600;              /* font-semibold */
  border-radius: 9999px;         /* rounded-full */
}

.badge-success {
  background-color: #d1fae5;     /* bg-emerald-100 */
  color: #065f46;                /* text-emerald-800 */
}

.badge-warning {
  background-color: #fef3c7;     /* bg-amber-100 */
  color: #92400e;                /* text-amber-800 */
}

.badge-error {
  background-color: #fee2e2;     /* bg-red-100 */
  color: #991b1b;                /* text-red-800 */
}
```

---

## 📐 Espaciado y Layout

### **Sistema de Espaciado**
```css
/* Espaciado de Secciones */
.space-section {
  margin-bottom: 2rem;           /* space-y-8 */
}

.space-component {
  margin-bottom: 1.5rem;         /* space-y-6 */
}

.space-element {
  margin-bottom: 1rem;           /* space-y-4 */
}

/* Padding Interno */
.padding-section {
  padding: 2rem;                 /* p-8 */
}

.padding-component {
  padding: 1.5rem;               /* p-6 */
}

.padding-element {
  padding: 1rem;                 /* p-4 */
}
```

### **Border Radius**
```css
.rounded-sm { border-radius: 0.125rem; }    /* 2px */
.rounded { border-radius: 0.25rem; }        /* 4px */
.rounded-md { border-radius: 0.375rem; }    /* 6px */
.rounded-lg { border-radius: 0.5rem; }      /* 8px */
.rounded-xl { border-radius: 0.75rem; }     /* 12px */
.rounded-2xl { border-radius: 1rem; }       /* 16px */
.rounded-full { border-radius: 9999px; }    /* Circular */
```

---

## 🔧 Utilidades CSS

### **Sombras**
```css
.shadow-xs { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow-sm { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1); }
```

### **Transiciones**
```css
.transition-colors { transition: color 0.2s, background-color 0.2s; }
.transition-all { transition: all 0.2s; }
.transition-transform { transition: transform 0.2s; }
.transition-opacity { transition: opacity 0.2s; }
```

### **Estados de Hover**
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-fade:hover {
  opacity: 0.8;
}
```

---

## 📋 Resumen de Clases Tailwind Más Utilizadas

### **Colores de Texto**
- `text-gray-900` - Texto principal
- `text-gray-600` - Texto secundario
- `text-gray-500` - Texto muted
- `text-gray-400` - Texto deshabilitado
- `text-primary` - Texto primario
- `text-destructive` - Texto de error

### **Colores de Fondo**
- `bg-white` - Fondo blanco
- `bg-gray-50` - Fondo gris muy claro
- `bg-gray-100` - Fondo gris claro
- `bg-primary` - Fondo primario
- `bg-card` - Fondo de tarjetas

### **Bordes**
- `border` - Borde estándar
- `border-gray-200` - Borde gris claro
- `border-gray-300` - Borde gris medio
- `border-primary` - Borde primario

### **Espaciado**
- `p-4` - Padding 1rem
- `p-6` - Padding 1.5rem
- `m-4` - Margin 1rem
- `space-y-4` - Espaciado vertical
- `gap-4` - Gap en grid/flex

### **Tipografía**
- `text-xs` - 0.75rem
- `text-sm` - 0.875rem
- `text-base` - 1rem
- `text-lg` - 1.125rem
- `text-xl` - 1.25rem
- `text-2xl` - 1.5rem
- `text-3xl` - 1.875rem

### **Peso de Fuente**
- `font-normal` - 400
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700

---

*Esta guía documenta todos los estilos visuales utilizados en la plataforma Feniz Trading. Mantén consistencia usando estas clases y patrones en todos los componentes.*
