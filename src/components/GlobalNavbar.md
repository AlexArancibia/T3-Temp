# Global Navbar - Siempre Dark Theme

El navbar global de la aplicación que permanece siempre en tema oscuro, independientemente del theme toggle del usuario.

## 🎨 Diseño Dark Fijo

### **Esquema de Colores**
```css
/* Background principal */
bg-gray-900        /* Fondo navbar */
border-gray-800    /* Bordes y separadores */

/* Textos */
text-white         /* Logo y usuario autenticado */
text-gray-300      /* Enlaces navegación normal */
text-white         /* Enlaces navegación hover */

/* Botones primarios */
bg-blue-600        /* Dashboard button */
hover:bg-blue-700  /* Dashboard button hover */

/* Estados especiales */
text-red-400       /* Sign out hover */
bg-gray-700        /* Avatar placeholder */
```

## 🧭 Estructura de Navegación

### **Desktop Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] MiApp    [Nav Links]         [Theme] [User] [Logout] │
└─────────────────────────────────────────────────────────────┘
```

### **Mobile Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] MiApp                                    [Menu ☰]     │
├─────────────────────────────────────────────────────────────┤
│ ▼ Mobile Menu                                               │
│   • Inicio                                                  │
│   • Información                                             │
│   • Servicios                                               │
│   • Contacto                                                │
│   ─────────────────                                         │
│   [Theme Toggle]                                            │
│   [User Info]                                               │
│   • Dashboard                                               │
│   • Cerrar Sesión                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Elementos Principales

### **Logo Section**
- **Logo**: Gradiente azul-púrpura con letra "A"
- **Texto**: "MiApp" en blanco bold
- **Link**: Redirige a página principal "/"

### **Navigation Links**
```typescript
const navigationItems = [
  { name: "Inicio", href: "/" },
  { name: "Información", href: "/info" },
  { name: "Servicios", href: "/services" },
  { name: "Contacto", href: "/contact" },
];
```
- **Color**: `text-gray-300` normal, `hover:text-white`
- **Responsive**: Ocultos en mobile, mostrados en dropdown

### **Auth Section**

#### **Usuario Autenticado**
- **Avatar**: Imagen del usuario o placeholder gris
- **Nombre**: Blanco bold
- **Dashboard**: Botón azul principal
- **Logout**: Ícono gris que se vuelve rojo en hover

#### **Usuario No Autenticado**
- **Iniciar Sesión**: Link gris a blanco en hover
- **Registrarse**: Botón azul principal

### **Theme Toggle**
- **Mantenido**: Aunque el navbar es dark fijo, el toggle controla el tema del resto de la app
- **Posición**: Visible tanto en desktop como mobile

## 📱 Responsive Behavior

### **Breakpoints**
- **md:hidden**: Mobile menu button
- **hidden md:block**: Desktop navigation
- **md:hidden**: Mobile dropdown menu

### **Mobile Menu**
- **Toggle**: Hamburger → X al abrir
- **Overlay**: Dropdown con mismo fondo dark
- **Enlaces**: Stack vertical con padding aumentado
- **Separadores**: Border gris oscuro entre secciones

## 🚫 Páginas Excluidas

El navbar NO se muestra en:
- `/signup` - Página de registro
- `/forgot-password` - Recuperación de contraseña  
- `/reset-password` - Reset de contraseña

## 🎯 Estados Visuales

### **Enlaces de Navegación**
```css
/* Normal */
.nav-link {
  color: #d1d5db;           /* gray-300 */
  transition: color 0.2s;
}

/* Hover */
.nav-link:hover {
  color: #ffffff;           /* white */
}
```

### **Botones Primarios**
```css
/* Dashboard / Registrarse */
.primary-button {
  background: #2563eb;      /* blue-600 */
  color: #ffffff;           /* white */
  transition: background 0.2s;
}

.primary-button:hover {
  background: #1d4ed8;      /* blue-700 */
}
```

### **Logout Button**
```css
/* Normal */
.logout-button {
  color: #d1d5db;           /* gray-300 */
}

/* Hover */
.logout-button:hover {
  color: #f87171;           /* red-400 */
}
```

## ⚡ Características Técnicas

### **Always Dark**
- **Independiente del theme**: El navbar mantiene `bg-gray-900` siempre
- **Contraste consistente**: Todos los textos optimizados para fondo oscuro
- **Sin CSS variables**: Colores hardcoded para evitar cambios de tema

### **Performance**
- **Conditional rendering**: Solo se monta si no está en páginas excluidas
- **Event handlers**: Memoizados implícitamente por ser funciones inline estables
- **Mobile state**: `useState` local para el toggle del menu

### **Accesibilidad**
- **title attributes**: En botones importantes como logout
- **alt texts**: En imágenes de avatar
- **Keyboard navigation**: Todos los elementos son navegables

## 🎨 Ventajas del Dark Fijo

1. **Consistencia Visual**: El navbar siempre se ve igual
2. **Identidad de Marca**: Refuerza el look profesional
3. **Contraste**: Mejor legibilidad en cualquier tema
4. **Simplicidad**: Sin lógica compleja de temas en la navegación
5. **Performance**: Una clase CSS menos para evaluar

El navbar dark fijo proporciona una **base visual sólida y profesional** para toda la aplicación! 🌟
