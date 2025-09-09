# Sistema RBAC en Dashboard

Este documento explica cómo se implementó el sistema de Control de Acceso Basado en Roles (RBAC) en el dashboard de la aplicación.

## 🎯 Objetivo

Mostrar información diferente en el dashboard según el rol y permisos del usuario, proporcionando una experiencia personalizada y segura.

## 🏗️ Arquitectura Implementada

### 1. Componentes de Dashboard Específicos por Rol

#### `AdminDashboard.tsx`
- **Para:** Super Administradores y Administradores
- **Características:**
  - Panel de administración completo
  - Estadísticas del sistema (usuarios, cuentas de trading, ingresos, uptime)
  - Herramientas de administración (gestión de usuarios, roles, cuentas de trading, reportes, configuración, monitoreo)
  - Actividad del sistema con prioridades
  - Estado del sistema en tiempo real

#### `TraderDashboard.tsx`
- **Para:** Usuarios con rol "Trader"
- **Características:**
  - Estadísticas de trading (P&L total, trades, tasa de ganancia, drawdown)
  - Métricas de rendimiento
  - Trades recientes con estado
  - Acciones de trading (nuevo trade, cuentas, análisis, historial)
  - Estado de la cuenta de trading

#### `ViewerDashboard.tsx`
- **Para:** Usuarios con rol "Viewer"
- **Características:**
  - Estadísticas de visualización (vistas, reportes vistos, puntos de datos)
  - Reportes disponibles para consulta
  - Acciones limitadas (ver reportes, dashboard público, documentación)
  - Actividad reciente de visualización
  - Estado de cuenta de visualización

### 2. Dashboard Principal Inteligente

El archivo `dashboard/page.tsx` actúa como un router inteligente que:

1. **Verifica permisos:** Usa el hook `useRBAC()` para obtener roles y permisos
2. **Muestra loading:** Mientras se cargan los permisos
3. **Valida acceso:** Verifica si el usuario puede ver el dashboard
4. **Renderiza apropiadamente:** Muestra el dashboard correcto según el rol
5. **Maneja casos especiales:** Usuarios sin roles específicos

### 3. Página de Prueba RBAC

#### `rbac-test/page.tsx`
- **Propósito:** Demostrar y probar el sistema RBAC
- **Características:**
  - Información completa del usuario
  - Lista de roles asignados
  - Lista de permisos asignados
  - Contenido condicional basado en permisos
  - Información de debug

## 🔧 Cómo Funciona

### Flujo de Autenticación y Autorización

1. **Usuario inicia sesión** → `useAuthContext()`
2. **Se cargan permisos** → `useRBAC()` hook
3. **Se verifica acceso** → `canViewDashboard` permission
4. **Se determina rol** → `isSuperAdmin`, `isAdmin`, `hasRole()`
5. **Se renderiza dashboard** → Componente apropiado

### Verificación de Permisos

```typescript
// Ejemplo de verificación de permisos
const { 
  isSuperAdmin, 
  isAdmin, 
  hasRole, 
  canViewDashboard, 
  isLoading 
} = useRBAC();

// Renderizar según rol
if (isSuperAdmin || isAdmin) {
  return <AdminDashboard user={user} />;
}

if (hasRole("trader")) {
  return <TraderDashboard user={user} />;
}

if (hasRole("viewer")) {
  return <ViewerDashboard user={user} />;
}
```

### Contenido Condicional

Cada dashboard muestra contenido específico basado en:
- **Roles del usuario** (admin, trader, viewer)
- **Permisos específicos** (manage users, manage trades, etc.)
- **Estado de la cuenta** (confirmada, activa, etc.)

## 🚀 Uso

### 1. Acceder al Dashboard
```
/dashboard
```
- Redirige automáticamente al dashboard apropiado según el rol

### 2. Probar el Sistema RBAC
```
/rbac-test
```
- Muestra información completa de roles y permisos
- Permite probar contenido condicional

### 3. Crear Usuario Administrador
```bash
bun run seed:admin
```
- Crea usuario admin con todos los permisos
- Email: admin@example.com
- Password: admin123

## 🎨 Características de UI/UX

### Diseño Responsivo
- Grid layouts adaptativos
- Componentes móviles-friendly
- Iconos consistentes (Lucide React)

### Indicadores Visuales
- **Colores por rol:**
  - Admin: Púrpura/Azul
  - Trader: Verde/Azul
  - Viewer: Azul/Índigo
- **Estados claros:** Loading, error, sin permisos
- **Iconos descriptivos:** Shield (admin), Target (trader), Eye (viewer)

### Experiencia de Usuario
- **Loading states:** Mientras se cargan permisos
- **Mensajes claros:** Para usuarios sin permisos
- **Navegación intuitiva:** Acciones rápidas por rol
- **Información relevante:** Estadísticas específicas por rol

## 🔒 Seguridad

### Validaciones Implementadas
1. **Verificación de autenticación:** `ProtectedRoute`
2. **Verificación de permisos:** `canViewDashboard`
3. **Verificación de roles:** `hasRole()`, `isAdmin`, `isSuperAdmin`
4. **Contenido condicional:** Solo se muestra lo permitido

### Prevención de Acceso No Autorizado
- Usuarios sin permisos ven mensaje de "Acceso Denegado"
- Usuarios sin roles ven mensaje de configuración pendiente
- Cada dashboard valida permisos específicos

## 📊 Métricas y Estadísticas

### Por Rol de Usuario

#### Admin Dashboard
- Total de usuarios
- Cuentas de trading
- Ingresos del sistema
- Uptime del sistema
- Alertas del sistema

#### Trader Dashboard
- P&L total y diario
- Trades totales y abiertos
- Tasa de ganancia
- Drawdown máximo
- Trades recientes

#### Viewer Dashboard
- Total de vistas
- Reportes vistos
- Puntos de datos disponibles
- Último acceso

## 🛠️ Extensibilidad

### Agregar Nuevos Roles
1. Crear componente `NewRoleDashboard.tsx`
2. Agregar verificación en `dashboard/page.tsx`
3. Actualizar `useRBAC` hook si es necesario

### Agregar Nuevos Permisos
1. Actualizar `DEFAULT_PERMISSIONS` en `types/rbac.ts`
2. Agregar verificación en `useRBAC` hook
3. Usar en componentes con `hasPermission()`

### Personalizar Dashboards
- Cada dashboard es independiente
- Fácil de modificar sin afectar otros
- Reutilizable y mantenible

## 🧪 Testing

### Página de Prueba
- `/rbac-test` proporciona testing completo
- Muestra todos los roles y permisos
- Permite verificar contenido condicional
- Incluye información de debug

### Casos de Prueba
1. **Usuario Admin:** Ve AdminDashboard
2. **Usuario Trader:** Ve TraderDashboard  
3. **Usuario Viewer:** Ve ViewerDashboard
4. **Usuario sin rol:** Ve mensaje de configuración
5. **Usuario sin permisos:** Ve mensaje de acceso denegado

## 📝 Notas de Implementación

- **TypeScript:** Tipado completo para mejor desarrollo
- **Tailwind CSS:** Estilos consistentes y responsivos
- **Lucide React:** Iconos consistentes
- **tRPC:** Comunicación type-safe con el backend
- **React Query:** Manejo de estado y cache
- **Modular:** Componentes reutilizables y mantenibles

Este sistema RBAC proporciona una base sólida para control de acceso granular y experiencias de usuario personalizadas según roles y permisos.
