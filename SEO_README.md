# SEO Configuration Guide

Este proyecto incluye una configuración completa de SEO básico con las siguientes características:

## 🚀 Características Implementadas

### 1. **Metadatos Dinámicos**
- Títulos y descripciones personalizables por página
- Open Graph para redes sociales
- Twitter Cards
- Metadatos estructurados

### 2. **Sitemap Automático**
- Generación automática de sitemap XML
- Configuración en `config/next/next-sitemap.config.js`
- Comando: `bun run sitemap`

### 3. **Robots.txt**
- Configuración automática de robots.txt
- Exclusión de rutas sensibles (`/api/`, `/admin/`, `/dashboard/`)

### 4. **Google Analytics**
- Integración completa con Google Analytics 4
- Tracking automático de páginas
- Eventos personalizables

### 5. **Datos Estructurados (JSON-LD)**
- Schema.org para Organization
- Schema.org para WebSite
- Schema.org para SoftwareApplication

## ⚙️ Configuración

### Variables de Entorno Requeridas

```bash
# SEO Básico
SITE_URL="https://your-domain.com"

# Verificación de Motores de Búsqueda
GOOGLE_VERIFICATION="your-google-verification-code"
YANDEX_VERIFICATION="your-yandex-verification-code"
YAHOO_VERIFICATION="your-yahoo-verification-code"

# Google Analytics
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Redes Sociales (opcional)
TWITTER_HANDLE="@your-twitter-handle"
FACEBOOK_APP_ID="your-facebook-app-id"
```

### Generación de Sitemap

```bash
# Generar sitemap estático
bun run sitemap

# El sitemap se genera en public/sitemap.xml
```

## 📁 Archivos de SEO

- `src/lib/seo.ts` - Configuración de metadatos
- `src/lib/analytics.ts` - Google Analytics
- `src/lib/structured-data.ts` - Datos estructurados
- `config/next/next-sitemap.config.js` - Configuración de sitemap
- `src/app/robots.txt/route.ts` - Robots.txt dinámico
- `src/app/sitemap.xml/route.ts` - Sitemap dinámico

## 🎯 Próximos Pasos

1. **Configurar variables de entorno** con tus datos reales
2. **Agregar imagen Open Graph** (`public/og-image.jpg`)
3. **Configurar Google Analytics** con tu ID de tracking
4. **Verificar en Google Search Console**
5. **Agregar más páginas al sitemap** según sea necesario

## 📊 Monitoreo

- **Google Search Console**: Para verificar indexación
- **Google Analytics**: Para métricas de tráfico
- **PageSpeed Insights**: Para rendimiento SEO
- **Lighthouse**: Para auditorías completas

## 🔧 Personalización

Para agregar metadatos a una nueva página:

```tsx
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: 'Mi Página',
  description: 'Descripción de mi página',
  keywords: ['keyword1', 'keyword2'],
})
```

Para agregar eventos de Analytics:

```tsx
import { event } from "@/lib/analytics"

// En un componente
event({
  action: 'click',
  category: 'button',
  label: 'signup',
  value: 1
})
```
