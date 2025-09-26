# 🔍 Sistema de Validación de Código

Este proyecto tiene configurado un sistema completo de validación que detecta errores de TypeScript, linting y otros problemas antes de hacer commit, push o build.

## 🚀 Comandos de Validación

### Validación Rápida
```bash
bun run validate
```
Ejecuta verificación de tipos y linting.

### Validación Completa
```bash
bun run validate:full
```
Ejecuta validación completa incluyendo build test.

### Verificación de Tipos
```bash
bun run type-check:strict
```
Verificación estricta de tipos TypeScript.

## 🔒 Hooks Automáticos

### Pre-commit Hook
Se ejecuta automáticamente antes de cada commit:
- ✅ Verificación estricta de tipos TypeScript (BLOQUEA)
- ⚠️ Linting con Biome (solo warnings, NO bloquea)
- ❌ Bloquea el commit solo si hay errores de TypeScript

### Pre-push Hook
Se ejecuta automáticamente antes de cada push:
- ✅ Validación de tipos TypeScript (BLOQUEA)
- ⚠️ Linting con Biome (solo warnings, NO bloquea)
- ❌ Bloquea el push solo si hay errores de TypeScript

### Build Validation
Se ejecuta automáticamente en cada build:
- ✅ Validación de tipos TypeScript antes del build
- ❌ Falla el build solo si hay errores de TypeScript

## 🛠️ CI/CD

El proyecto incluye GitHub Actions que valida:
- ✅ Verificación de tipos TypeScript
- ✅ Linting
- ✅ Formato de código
- ✅ Build test
- ❌ Falla el PR si hay errores

## 🎯 Tipos de Errores Detectados

### TypeScript (CRÍTICO - Bloquea commit/push/build)
- ❌ Tipos implícitos `any`
- ❌ Variables no utilizadas
- ❌ Parámetros no utilizados
- ❌ Errores de tipos
- ❌ Código inalcanzable

### Linting (Biome) - Solo Warnings
- ⚠️ Código no utilizado (warnings)
- ⚠️ Variables no declaradas (warnings)
- ⚠️ Problemas de estilo (warnings)
- ⚠️ Mejores prácticas (warnings)
- ⚠️ Accesibilidad (warnings)
- ⚠️ Performance (warnings)

## 🚨 Solución de Problemas

### Error: "Parameter implicitly has an 'any' type"
```typescript
// ❌ Malo
{items.map((item) => <div key={item.id}>{item.name}</div>)}

// ✅ Bueno
{items.map((item: { id: string; name: string }) => <div key={item.id}>{item.name}</div>)}
```

### Error: "Variable is declared but never used"
```typescript
// ❌ Malo
const unusedVariable = "hello";

// ✅ Bueno
const usedVariable = "hello";
console.log(usedVariable);
```

## 📝 Flujo de Trabajo Recomendado

1. **Desarrollo**: Escribe tu código
2. **Validación local**: `bun run validate:full`
3. **Commit**: `git commit` (se ejecuta pre-commit automáticamente)
4. **Push**: `git push` (se ejecuta pre-push automáticamente)
5. **CI/CD**: GitHub Actions valida automáticamente

## 🔧 Configuración

- **TypeScript**: `tsconfig.typecheck.json`
- **Linting**: `biome.json`
- **Pre-commit**: `.husky/pre-commit`
- **Pre-push**: `.husky/pre-push`
- **CI/CD**: `.github/workflows/validate.yml`

## 💡 Tips

- Usa `bun run fix` para corregir automáticamente problemas de linting
- Usa `bun run format:fix` para formatear el código automáticamente
- Los hooks se pueden saltar con `--no-verify` (no recomendado)
- Revisa los logs de CI/CD en GitHub para ver errores detallados
