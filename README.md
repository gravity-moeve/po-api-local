# PO API Local

API local para manejo de escenarios y estados de proyectos.

## 🚀 Endpoints Disponibles

### GET `/api/statuses`
Retorna la lista de todos los estados disponibles con sus propiedades.

### GET `/api/scenarios`
Retorna la lista de todos los escenarios con sus estados correspondientes.

## 🏗️ Estructura del Proyecto

```
src/
├── types/           # Definiciones de tipos TypeScript
├── data/            # Datos mock para desarrollo
├── controllers/     # Lógica de negocio
├── routes/          # Manejo de rutas HTTP
├── utils/           # Utilidades y helpers
└── server.ts        # Configuración del servidor
```

## 🛠️ Tecnologías

- **Bun** - Runtime y package manager
- **TypeScript** - Tipado estático
- **Bun.serve** - Servidor HTTP nativo

## 📦 Instalación y Uso

```bash
# Instalar dependencias
bun install

# Ejecutar en modo desarrollo (con watch)
bun run dev

# Ejecutar en modo producción
bun run start
```

## 🔧 Scripts Disponibles

- `bun run start` - Inicia el servidor
- `bun run dev` - Inicia el servidor en modo desarrollo con watch

El servidor se ejecuta en `http://localhost:3001`
