# SEO CHECKLIST — pempa.com.ar

## ✅ Implementado en el código

- [x] **Title tag** optimizado (`<title>Asociación PEMPA | Protectora de Equinos de Mendoza</title>`)
- [x] **Meta description** (150-160 chars) con keywords
- [x] **Meta keywords** (PEMPA, caballos Mendoza, donar, ONG, etc.)
- [x] **Meta robots** (index, follow)
- [x] **Geo tags** (AR-M, Mendoza, Argentina)
- [x] **Canonical URL** apuntando a https://pempa.com.ar/
- [x] **Open Graph** completo (Facebook, WhatsApp shares)
- [x] **Twitter Cards** (summary_large_image)
- [x] **Structured Data Schema.org** tipo NGO con todos los datos
- [x] **Favicon** y apple-touch-icon
- [x] **Theme-color** para mobile
- [x] **Lang attribute** en HTML (`lang="es-AR"`)
- [x] **Sitemap.xml** completo con secciones internas
- [x] **Robots.txt** con sitemap incluido
- [x] **404.html** personalizada (no genérica)
- [x] **HTTPS forzado** (configurar en Cloudflare Pages)
- [x] **Headers de seguridad** (XSS, frame-options, etc.)
- [x] **Cache headers** optimizados (1 año assets, 1h HTML)
- [x] **Lazy loading** en todas las imágenes de galería
- [x] **Decoding async** en imágenes
- [x] **Preconnect** a Google Fonts
- [x] **Alt text** descriptivo en todas las imágenes
- [x] **Aria labels** en botones e iconos
- [x] **Semantic HTML** (header, nav, main, section, article, footer)
- [x] **Mobile responsive** (mobile-first)
- [x] **Reduced motion** support para accesibilidad

---

## ⚠️ Pendiente (acciones manuales)

### 1. Google Search Console
- [ ] Crear propiedad en https://search.google.com/search-console
- [ ] Añadir URL: `https://pempa.com.ar`
- [ ] Descargar archivo de verificación
- [ ] Reemplazar `google-site-verification.html` con el descargado
- [ ] Hacer click en "Verificar"
- [ ] **Submit del sitemap**: `https://pempa.com.ar/sitemap.xml`

### 2. Google Analytics 4 (opcional pero recomendado)
- [ ] Crear cuenta GA4 en https://analytics.google.com
- [ ] Obtener Measurement ID (G-XXXXXXXXXX)
- [ ] Insertar el snippet en `index.html` antes de `</head>`:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```

### 3. Imagen Open Graph
- [ ] Crear imagen `og-image.jpg` (1200x630px)
- [ ] Subir a `/img/og-image.jpg`
- [ ] Sugerencia: foto del logo + un caballo + texto "PEMPA — Protegemos a los caballos de Mendoza"
- [ ] Verificar con https://www.opengraph.xyz/

### 4. Google Business Profile
- [ ] Crear perfil de Google Business como ONG
- [ ] Conectar con el sitio
- [ ] Agregar fotos del predio (las públicas)
- [ ] Configurar zona de cobertura: Maipú, Mendoza

### 5. Bing Webmaster Tools
- [ ] Submit en https://www.bing.com/webmasters
- [ ] Importar desde Google Search Console (opción rápida)
- [ ] Submit del sitemap

### 6. Redes sociales (link en bio)
- [ ] Actualizar bio de Instagram con `pempa.com.ar`
- [ ] Actualizar Facebook con el link al sitio
- [ ] Pin de post anunciando el lanzamiento

---

## 📊 Performance objetivos (Core Web Vitals)

Después del deploy, verificar en https://pagespeed.web.dev/:

- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID/INP** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

Si LCP es alto, considerar:
- Convertir el video hero a un poster image + lazy load del video
- Comprimir más los videos (usar HandBrake con preset "Web Optimized")
- Usar un CDN para los videos (Cloudflare Stream)

---

## 🔍 Keywords objetivo

**Primarias:**
- protectora caballos mendoza
- pempa
- rescate equinos mendoza
- donar caballos mendoza
- maltrato animal mendoza

**Secundarias:**
- equinoterapia mendoza
- adoptar caballo argentina
- ONG caballos
- padrino caballo
- voluntariado animales mendoza

**Long tail:**
- como ayudar a una protectora de caballos
- donar a asociación pempa
- caballos rescatados maipu

---

## 🔗 Link building (acciones a futuro)

- [ ] Pedir backlink desde sitio del Municipio de Maipú (ya hay relación)
- [ ] Solicitar mención en notas de medios locales (Diario Uno, Mendoza Post, Los Andes — ya hay artículos previos)
- [ ] Directorios de ONG argentinas
- [ ] Wikipedia: crear/editar artículo sobre PEMPA
- [ ] Networking con otras protectoras de Argentina

---

## 📅 Mantenimiento mensual

- [ ] Verificar que el sitio carga correctamente
- [ ] Revisar Google Search Console (errores, queries)
- [ ] Subir fotos nuevas de caballos cuando haya
- [ ] Actualizar el sitemap si se agregan secciones
- [ ] Revisar performance en pagespeed.web.dev
- [ ] Verificar links de WhatsApp / PayPal / redes
