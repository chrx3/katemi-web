# Admin Panel — Katemi Web

## Concepto y Visión

Panel de administración para Katemi construido en Next.js, conectado a PocketBase via API. Permite editar servicios, proyectos, clientes, configuración del sitio y ver contactos recibidos. Diseño profesional con la estética de Katemi (azul oscuro + verdeazul). Protegido con password simple.

## Stack

- Next.js App Router (`/admin/*`)
- PocketBase JS SDK (`src/lib/pocketbase.ts`)
- TailwindCSS (ya instalado)
- Autenticación por cookie/sesión (password simple, no OAuth)
- Sonner (ya instalado) para notificaciones

## Rutas

```
/admin                    → Dashboard (stats rápido)
/admin/login             → Login (password único)
/admin/servicios         → CRUD Servicios
/admin/proyectos         → CRUD Proyectos
/admin/clientes          → CRUD Clientes
/admin/config            → Configuración general (email, teléfono, redes)
/admin/contactos         → Ver contactos recibidos (solo lectura)
```

## Diseño

### Layout
- Sidebar izquierda con navegación
- Header con logo Katemi y logout
- Contenido principal a la derecha
- Sin Navbar/Footer público (layout propio)
- Máximo ancho contenido: 1200px
- bg: #F5F5F5, sidebar: #0B1D3A

### Login
- Centrado, card con password único guardado en env
- Mensaje de error si password incorrecto
- Cookie de sesión válida 7 días

## Estructura de Datos (PocketBase)

### Collections a usar:
1. **services** — slug, title, shortDescription, fullDescription, features (json), image, icon, order, isActive
2. **projects** — slug, clientName, title, location, description, servicesProvided (json), images (files), category, year, isFeatured, isActive
3. **clients** — name, logo, website, order, isActive
4. **siteConfig** — key-value para configuración general
5. **contacts** — nombre, email, teléfono, asunto, mensaje, fecha

## Páginas — Especificación

### /admin/login
- Input password con botón "Ingresar"
- Error: "Password incorrecto" (rojo)
- Éxito: redirect a /admin
- Check password contra env ADMIN_PASSWORD

### /admin
- Cards con stats:
  - X servicios activos
  - X proyectos activos
  - X clientes
  - X contactos nuevos
- Links rápidos a cada sección

### /admin/servicios
- Tabla: título, slug, orden, estado (activo/inactivo)
- Botón "+ Nuevo servicio" → abre modal o pagina
- Editar: click en fila → modal con form
- Campos: title, slug (auto-generado), shortDescription, fullDescription (textarea), features (json array como textarea JSON), icon (text), image (upload), order, isActive
- Borrar: botón con confirmación

### /admin/proyectos
- Tabla: título, cliente, categoría, año, destacado
- Editar/borrar igual que servicios
- Campos: title, slug, clientName, location, description, servicesProvided (json), images (multi file upload), category (select), year, isFeatured, isActive

### /admin/clientes
- Tabla: nombre, website, orden, estado
- CRUD simple: name, logo (file), website, order, isActive

### /admin/config
- Lista de campos editables:
  - emailContacto (text)
  - telefono (text)
  - linkedinUrl (text)
  - instagramUrl (text)
  - heroTitulo (text)
  - heroSubtitulo (textarea)
- Cada campo guarda en siteConfig con key únicos
- Botón guardar al final

### /admin/contactos
- Tabla: nombre, email, teléfono, asunto, fecha
- Solo lectura — no permite editar/borrar (por ahora)
- Ver mensaje en modal al click

## API / Librería

### PocketBase helpers (nuevo archivo: `src/lib/pb-admin.ts`)
```typescript
// Login
authWithPassword(email, password): Promise<Admin>

// Servicios
getServices(), createService(data), updateService(id, data), deleteService(id)

// Proyectos
getProjects(), createProject(data), updateProject(id, data), deleteProject(id)

// Clientes
getClients(), createClient(data), updateClient(id, data), deleteClient(id)

// SiteConfig
getConfig(), setConfig(key, value)

// Contactos
getContacts()
```

## Auth (Cookie)

```typescript
// Middleware: src/middleware.ts
// Check cookie 'admin-session' existe y es válido
// Si no existe y la ruta es /admin/* (excepto /admin/login), redirect a login
```

## Dependencias externas

- PocketBase JS SDK (ya instalado con npm)
- Lucide icons (ya instalado)
- Sonner (ya instalado para toasts)

## Implementación — Orden de tareas

1. **Middleware auth** — proteger rutas /admin
2. **Login page** — /admin/login
3. **Admin layout** — sidebar + header
4. **Dashboard** — /admin/page
5. **Librería pb-admin** — helpers para API
6. **Servicios page** — CRUD completo
7. **Proyectos page** — CRUD completo
8. **Clientes page** — CRUD completo
9. **Config page** — edit siteConfig
10. **Contactos page** — view only

## Notas

- Auto-generate slug desde title (lower-case, replace spaces with -, remove special chars)
- Confirmación antes de borrar cualquier registro
- Toast de éxito/error en todas las operaciones
- Loading states con skeleton o spinner
- Responsive: sidebar colapsa en mobile

