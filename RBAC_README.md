# RBAC (Role-Based Access Control) System

Este sistema RBAC completo proporciona control de acceso granular basado en roles y permisos para la aplicación.

## 🏗️ Arquitectura

### Modelos de Base de Datos

- **Role**: Define roles del sistema (admin, trader, viewer, etc.)
- **Permission**: Define permisos específicos (CREATE USER, READ TRADE, etc.)
- **UserRole**: Asigna roles a usuarios
- **RolePermission**: Asigna permisos a roles

### Componentes Principales

1. **RBACService**: Servicio principal para operaciones RBAC
2. **RBAC Middleware**: Middleware para protección de rutas
3. **useRBAC Hook**: Hook de React para funcionalidad RBAC
4. **RBACProtected Component**: Componente para proteger contenido
5. **tRPC Router**: API para gestión de roles y permisos

## 🚀 Uso

### 1. Configuración Inicial

```bash
# Ejecutar migración de base de datos
npx prisma migrate dev --name add_rbac_system

# Poblar datos iniciales
npx tsx src/lib/seedRBAC.ts
```

### 2. Uso en Componentes React

```tsx
import { useRBAC } from "@/hooks/useRBAC";
import RBACProtected from "@/components/RBACProtected";

function MyComponent() {
  const { hasPermission, isAdmin, canManageUsers } = useRBAC();

  return (
    <div>
      {/* Verificación de permisos */}
      {hasPermission(PermissionAction.CREATE, PermissionResource.USER) && (
        <button>Create User</button>
      )}

      {/* Contenido protegido */}
      <RBACProtected requireAdmin>
        <AdminPanel />
      </RBACProtected>
    </div>
  );
}
```

### 3. Protección de Rutas API

```tsx
import { requirePermission, requireAdmin } from "@/middlewares/rbac";

// Proteger endpoint con permiso específico
export async function POST(req: NextRequest) {
  const permissionCheck = await requirePermission(
    PermissionAction.CREATE,
    PermissionResource.USER
  )(req);
  
  if (permissionCheck) return permissionCheck;
  
  // Lógica del endpoint
}

// Proteger endpoint con rol de admin
export async function GET(req: NextRequest) {
  const adminCheck = await requireAdmin()(req);
  
  if (adminCheck) return adminCheck;
  
  // Lógica del endpoint
}
```

### 4. Uso con tRPC

```tsx
// En un componente
const { data: userRoles } = trpc.rbac.getUserRoles.useQuery({ userId });
const { data: canManageUsers } = trpc.rbac.canManageUsers.useQuery({ userId });

// Mutaciones
const assignRole = trpc.rbac.assignRole.useMutation();
const removeRole = trpc.rbac.removeRole.useMutation();
```

## 🎯 Roles Predefinidos

### Super Admin
- Acceso completo al sistema
- Todos los permisos
- No puede ser eliminado

### Admin
- Acceso administrativo a la mayoría de funciones
- Gestión de usuarios, cuentas de trading, trades
- No puede gestionar roles de super admin

### Moderator
- Gestión básica de usuarios
- Acceso de solo lectura a trades
- Acceso al dashboard

### Trader
- Gestión completa de cuentas de trading
- Gestión completa de trades
- Acceso a símbolos, propfirms, brokers

### Viewer
- Acceso de solo lectura
- Visualización del dashboard
- Sin permisos de modificación

## 🔐 Permisos Disponibles

### Recursos
- `USER`: Gestión de usuarios
- `ROLE`: Gestión de roles
- `PERMISSION`: Gestión de permisos
- `TRADING_ACCOUNT`: Cuentas de trading
- `TRADE`: Operaciones de trading
- `PROPFIRM`: Propfirms
- `BROKER`: Brokers
- `SYMBOL`: Símbolos de trading
- `SUBSCRIPTION`: Suscripciones
- `DASHBOARD`: Panel de control
- `ADMIN`: Panel administrativo

### Acciones
- `CREATE`: Crear recursos
- `READ`: Leer recursos
- `UPDATE`: Actualizar recursos
- `DELETE`: Eliminar recursos
- `MANAGE`: Gestión completa (incluye todas las acciones)

## 🛠️ API Disponible

### Consultas (Queries)
- `getAllRoles()`: Obtener todos los roles
- `getAllPermissions()`: Obtener todos los permisos
- `getUserRoles(userId)`: Obtener roles de un usuario
- `getUserPermissions(userId)`: Obtener permisos de un usuario
- `checkPermission(userId, action, resource)`: Verificar permiso específico
- `checkRole(userId, roleName)`: Verificar rol específico
- `isAdmin(userId)`: Verificar si es admin
- `isSuperAdmin(userId)`: Verificar si es super admin
- `canManageUsers(userId)`: Verificar si puede gestionar usuarios
- `canManageRoles(userId)`: Verificar si puede gestionar roles
- `canAccessAdmin(userId)`: Verificar acceso al panel admin
- `canManageTradingAccounts(userId)`: Verificar gestión de cuentas
- `canManageTrades(userId)`: Verificar gestión de trades
- `canViewDashboard(userId)`: Verificar acceso al dashboard

### Mutaciones (Mutations)
- `createRole(data)`: Crear nuevo rol
- `createPermission(data)`: Crear nuevo permiso
- `assignRole(userId, roleId, assignedBy?, expiresAt?)`: Asignar rol a usuario
- `removeRole(userId, roleId)`: Remover rol de usuario
- `assignPermissionToRole(roleId, permissionId)`: Asignar permiso a rol
- `removePermissionFromRole(roleId, permissionId)`: Remover permiso de rol

## 🔧 Componentes de Protección

### RBACProtected
Componente principal para proteger contenido:

```tsx
<RBACProtected
  action={PermissionAction.CREATE}
  resource={PermissionResource.USER}
  fallback={<div>No tienes permisos</div>}
>
  <CreateUserForm />
</RBACProtected>
```

### Componentes de Conveniencia
- `AdminOnly`: Solo para administradores
- `SuperAdminOnly`: Solo para super administradores
- `UserManagementOnly`: Solo para gestión de usuarios
- `RoleManagementOnly`: Solo para gestión de roles
- `TradingAccountManagementOnly`: Solo para gestión de cuentas
- `TradeManagementOnly`: Solo para gestión de trades
- `DashboardAccessOnly`: Solo para acceso al dashboard

## 📝 Ejemplos de Uso

### Verificación de Permisos en Componente

```tsx
function UserManagement() {
  const { hasPermission, canManageUsers } = useRBAC();

  if (!canManageUsers) {
    return <div>No tienes permisos para gestionar usuarios</div>;
  }

  return (
    <div>
      {hasPermission(PermissionAction.CREATE, PermissionResource.USER) && (
        <button>Crear Usuario</button>
      )}
      {hasPermission(PermissionAction.DELETE, PermissionResource.USER) && (
        <button>Eliminar Usuario</button>
      )}
    </div>
  );
}
```

### Protección de Múltiples Permisos

```tsx
<RBACProtected
  permissions={[
    { action: PermissionAction.CREATE, resource: PermissionResource.TRADE },
    { action: PermissionAction.READ, resource: PermissionResource.TRADING_ACCOUNT }
  ]}
  requireAll={false} // Requiere CUALQUIERA de los permisos
>
  <TradingInterface />
</RBACProtected>
```

### Verificación de Roles

```tsx
function AdminPanel() {
  const { hasRole, hasAnyRole } = useRBAC();

  if (!hasAnyRole(['admin', 'super_admin'])) {
    return <div>Acceso denegado</div>;
  }

  return <div>Panel de administración</div>;
}
```

## 🚨 Consideraciones de Seguridad

1. **Validación del Lado del Servidor**: Siempre validar permisos en el servidor, no solo en el cliente
2. **Tokens JWT**: Los tokens incluyen información de RBAC para validación rápida
3. **Roles del Sistema**: Los roles marcados como `isSystem: true` no pueden ser eliminados
4. **Expiración de Roles**: Los roles pueden tener fecha de expiración para acceso temporal
5. **Auditoría**: El sistema registra quién asignó cada rol (`assignedBy`)

## 🔄 Flujo de Trabajo Típico

1. **Inicialización**: Ejecutar seed para crear roles y permisos por defecto
2. **Asignación de Roles**: Asignar roles apropiados a usuarios existentes
3. **Protección de Rutas**: Usar middleware RBAC en rutas API
4. **Protección de UI**: Usar componentes RBACProtected en la interfaz
5. **Gestión Dinámica**: Usar la API tRPC para gestionar roles y permisos

## 📊 Monitoreo y Debugging

El sistema incluye logging detallado para:
- Verificación de permisos
- Asignación/remoción de roles
- Errores de autorización
- Contexto RBAC en requests

Usar `console.log` y herramientas de debugging para monitorear el comportamiento del sistema.
