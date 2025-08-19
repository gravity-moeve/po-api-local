# PO API Local

API local para manejo de escenarios y estados de proyectos, implementando la especificación OpenAPI completa.

## 🚀 Endpoints Disponibles

### Scenarios
- **`GET /api/scenarios/statuses`** - Obtener todos los estados disponibles
- **`GET /api/scenarios`** - Obtener lista de escenarios (con filtros opcionales)
- **`POST /api/scenarios`** - Crear un nuevo escenario

### Input Tables
- **`GET /api/scenarios/{id}/inputs/definitions`** - Obtener definiciones de tablas para inputs
- **`GET /api/scenarios/{id}/inputs/{tableId}/dataset`** - Obtener dataset de una tabla de input
- **`PUT /api/scenarios/{id}/inputs/{tableId}/dataset`** - Reemplazar dataset completo
- **`POST /api/scenarios/{id}/inputs/{tableId}/dataset/upload-csv`** - Subir CSV para reemplazar dataset
- **`POST /api/scenarios/{id}/inputs/{tableId}/dataset/sync-from-datalake`** - Sincronizar desde datalake
- **`POST /api/scenarios/{id}/inputs/{tableId}/dataset/download-csv`** - Generar enlace de descarga CSV

### Simulation
- **`POST /api/scenarios/{id}/run`** - Ejecutar simulación para un escenario

## 🔍 Filtros Disponibles

### GET /api/scenarios
- **`status`** - Filtrar por estado (ej: `?status=running`)
- **`creationDate`** - Filtrar por fecha de creación (ej: `?creationDate=2025-08-04`)

### GET /api/scenarios/{id}/inputs/{tableId}/dataset
- **`page`** - Número de página (default: 1)
- **`pageSize`** - Tamaño de página (default: 100, max: 1000)

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

## 📋 Ejemplos de Uso

### Crear un nuevo escenario
```bash
curl -X POST http://localhost:3001/api/scenarios \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Proyecto",
    "periods": [
      {
        "startDate": "2025-09-01T00:00:00",
        "endDate": "2025-12-01T00:00:00"
      }
    ]
  }'
```

### Filtrar escenarios por estado
```bash
curl "http://localhost:3001/api/scenarios?status=running"
```

### Obtener definiciones de tablas
```bash
curl "http://localhost:3001/api/scenarios/1/inputs/definitions"
```

### Ejecutar simulación
```bash
curl -X POST "http://localhost:3001/api/scenarios/1/run"
```
