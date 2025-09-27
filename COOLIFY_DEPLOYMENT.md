# Despliegue en Coolify - Feniz Trading Platform

## Configuración para Coolify

### 1. Variables de Entorno Requeridas

En Coolify, configura estas variables de entorno:

```bash
# Base de datos (ajusta la URL para producción)
DATABASE_URL=postgres://postgres:PASSWORD@HOST:5432/feniz

# Autenticación (genera secretos seguros)
BETTER_AUTH_SECRET=tu-secreto-super-seguro-64-caracteres-minimo
JWT_SECRET=otro-secreto-muy-seguro-para-jwt

# URLs del sitio (IMPORTANTE: cambiar por tu dominio real)
NEXT_PUBLIC_API_URL=https://tu-dominio.com
NEXTAUTH_URL=https://tu-dominio.com

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Email (Estrategia GS SMTP)
NODEMAILER_USER=test@estrategiags.com
NODEMAILER_PASSWORD=HWmmjDNI234234
NODEMAILER_SMTP=mail.estrategiags.com
NODEMAILER_PORT=465
```

### 2. Configuración del Proyecto en Coolify

1. **Tipo de Proyecto**: Docker Compose
2. **Archivo**: `docker-compose.coolify.yml` (recomendado) o `docker-compose.yml`
3. **Puerto**: 3000
4. **Dominio**: Configura tu dominio personalizado
5. **SSL**: Habilitar automáticamente

### 3. Pasos de Despliegue

#### Opción A: Repositorio Git
1. Conecta tu repositorio de GitHub
2. Coolify detectará automáticamente el `Dockerfile`
3. Configura las variables de entorno
4. Despliega

#### Opción B: Docker Compose
1. Sube el código a tu repositorio
2. En Coolify, selecciona "Docker Compose"
3. Apunta al archivo `docker-compose.coolify.yml`
4. Configura variables de entorno
5. Despliega

### 4. Variables de Entorno Críticas para Producción

```bash
# IMPORTANTE: Cambiar estos valores por los reales
NEXT_PUBLIC_API_URL=https://feniz.tudominio.com
NEXTAUTH_URL=https://feniz.tudominio.com

# Base de datos de producción
DATABASE_URL=postgres://user:pass@host:5432/feniz_prod

# Generar secretos seguros (mínimo 32 caracteres)
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
```

### 5. Comandos para Generar Secretos Seguros

```bash
# Generar BETTER_AUTH_SECRET
openssl rand -hex 32

# Generar JWT_SECRET  
openssl rand -hex 32

# O usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Configuración de Base de Datos

Si usas una base de datos externa:
1. Crea la base de datos `feniz` 
2. Asegúrate de que el usuario tenga permisos completos
3. La aplicación ejecutará migraciones automáticamente al iniciarse

### 7. Verificación Post-Despliegue

1. **Health Check**: Coolify monitoreará automáticamente `/` 
2. **Logs**: Revisa los logs en Coolify para errores
3. **Base de Datos**: Verifica que las migraciones se ejecutaron
4. **Autenticación**: Prueba el login con Google OAuth

### 8. Troubleshooting Común

#### Error: "Missing required environment variable"
- Verifica que todas las variables estén configuradas en Coolify
- Asegúrate de que no haya espacios extra en los valores

#### Error: "Cannot connect to database"
- Verifica la URL de la base de datos
- Asegúrate de que la base de datos esté accesible desde Coolify
- Revisa los permisos del usuario de la base de datos

#### Error: "OAuth redirect mismatch"
- Actualiza la URL de callback en Google Console
- Debe ser: `https://tu-dominio.com/api/auth/callback/google`

#### La aplicación no responde
- Verifica que el puerto 3000 esté expuesto
- Revisa los logs del contenedor
- Confirma que el health check pase

### 9. Configuración de Dominio

1. En Coolify, ve a tu aplicación
2. Ve a "Domains"
3. Agrega tu dominio personalizado
4. Coolify generará automáticamente SSL con Let's Encrypt

### 10. Monitoreo

Coolify incluye:
- **Health checks** automáticos cada 30 segundos
- **Logs** en tiempo real
- **Métricas** de CPU y memoria
- **Alertas** cuando la aplicación falla

### 11. Actualización/Redeploy

Para actualizar la aplicación:
1. Haz push a tu repositorio
2. En Coolify, haz clic en "Deploy"
3. Coolify construirá y desplegará automáticamente

### 12. Backup de Base de Datos

Si usas la base de datos externa, asegúrate de:
1. Configurar backups regulares
2. Probar la restauración
3. Tener un plan de recuperación

## Checklist Pre-Despliegue

- [ ] Variables de entorno configuradas
- [ ] Secretos generados de forma segura  
- [ ] Base de datos accesible
- [ ] Dominio configurado
- [ ] Google OAuth configurado (si se usa)
- [ ] SMTP configurado (si se usa)
- [ ] Health check funcionando

## Support

Si tienes problemas:
1. Revisa los logs en Coolify
2. Verifica las variables de entorno
3. Confirma que la base de datos esté accesible
4. Revisa la documentación de Coolify
