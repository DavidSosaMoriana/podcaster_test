# Podcaster App 🎧

Una aplicación Single Page Application (SPA) para escuchar podcasts musicales, desarrollada como prueba técnica. La aplicación permite explorar los 100 podcasts más populares, ver detalles de cada podcast y reproducir episodios individuales.

## 🚀 Características

### Funcionalidades Principales

- **Vista Principal**: Lista de 100 podcasts más populares de iTunes
- **Filtrado en tiempo real**: Búsqueda por nombre del podcast o autor
- **Detalle de Podcast**: Información completa y lista de episodios
- **Reproductor de Audio**: Reproductor HTML5 nativo para episodios
- **Navegación SPA**: URLs limpias sin hash (#)
- **Cache inteligente**: Datos almacenados por 24 horas en localStorage

### Características Técnicas

- ✅ **React 18** con TypeScript completo
- ✅ **Context API** para gestión de estado global
- ✅ **Custom hooks** para lógica reutilizable
- ✅ **React Router** para navegación sin hash
- ✅ **Webpack** configurado para desarrollo y producción
- ✅ **CSS desde cero** con variables CSS y diseño responsive
- ✅ **ESLint + Prettier** para calidad de código
- ✅ **Cache automático** con expiración de 24 horas
- ✅ **Componentes modulares** creados desde cero

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AudioPlayer/     # Reproductor HTML5
│   ├── EpisodeList/     # Lista de episodios
│   ├── Header/          # Cabecera de la aplicación
│   ├── Layout/          # Layout principal
│   ├── LoadingSpinner/  # Indicador de carga
│   ├── PodcastCard/     # Tarjeta de podcast
│   ├── PodcastSidebar/  # Sidebar con info del podcast
│   └── SearchFilter/    # Filtro de búsqueda
├── context/             # Context API de React
│   └── AppContext.tsx   # Estado global de la aplicación
├── hooks/               # Custom hooks
│   ├── usePodcasts.ts   # Hook para lista de podcasts
│   ├── usePodcastDetail.ts # Hook para detalle de podcast
│   └── useLoadPodcasts.ts  # Hook para carga inicial
├── services/            # Servicios y APIs
│   ├── apiService.ts    # Cliente HTTP con proxy CORS
│   ├── cacheService.ts  # Gestión del cache localStorage
│   └── podcastService.ts # Lógica de negocio de podcasts
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos
├── views/               # Vistas principales
│   ├── HomeView/        # Vista principal
│   ├── PodcastDetailView/ # Vista detalle podcast
│   └── EpisodeDetailView/ # Vista detalle episodio
├── styles/              # Estilos globales
│   └── globals.css      # Variables CSS y estilos base
└── utils/               # Utilidades (futuro)
```

### Patrones de Diseño Utilizados

#### 1. **Arquitectura por Capas**

- **Presentación**: Componentes React y vistas
- **Lógica de Negocio**: Custom hooks y servicios
- **Datos**: Context API y cache localStorage
- **Comunicación**: Servicios de API con manejo de errores

#### 2. **Principios SOLID**

- **SRP**: Cada componente tiene una responsabilidad única
- **OCP**: Componentes extensibles sin modificación
- **DIP**: Dependencias a través de props e interfaces

#### 3. **Separation of Concerns**

- **Componentes**: Solo presentación y eventos UI
- **Hooks**: Lógica de estado y efectos
- **Servicios**: Comunicación con APIs y cache
- **Context**: Estado global compartido

## 🛠️ Decisiones de Diseño

### ¿Por qué Context API en lugar de Redux?

- **Simplicidad**: El estado de la aplicación es relativamente simple
- **Rendimiento**: Context API es suficiente para este caso de uso
- **Requerimiento**: La prueba específicamente requiere Context API
- **Menos boilerplate**: Menos código para mantener

### ¿Por qué Custom Hooks?

- **Reutilización**: Lógica compartible entre componentes
- **Separación**: Lógica de negocio separada de UI
- **Testabilidad**: Hooks son fáciles de testear unitariamente
- **Composición**: Permiten componer funcionalidades complejas

### ¿Por qué Cache en localStorage?

- **Rendimiento**: Evita peticiones innecesarias a iTunes API
- **Experiencia**: Carga instantánea en visitas repetidas
- **Requerimiento**: Especificado en la prueba (24h de cache)
- **Offline**: Funciona parcialmente sin conexión

### ¿Por qué CSS Variables?

- **Mantenibilidad**: Cambios de tema centralizados
- **Performance**: CSS nativo es más rápido que CSS-in-JS
- **Responsive**: Fácil adaptación a diferentes breakpoints
- **Requerimiento**: CSS desde cero sin librerías

## 🔧 Instalación y Uso

### Prerrequisitos

- Node.js >= 16
- npm >= 8

### Instalación

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd podcaster

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Modo desarrollo (assets sin minimizar)
npm start

# La aplicación se abrirá en http://localhost:3000
```

### Producción

```bash
# Build para producción (assets minimizados y concatenados)
npm run build

# Los archivos se generan en la carpeta /dist
```

### Otros Comandos

```bash
# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint
npm run lint:fix

# Formatear código
npm run format

# Ejecutar tests
npm test
npm run test:watch
```

## 🌐 APIs Utilizadas

### iTunes API

- **Top Podcasts**: `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Podcast Details**: `https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20`

### Proxy CORS

- **AllOrigins**: `https://allorigins.win/get?url={encoded_url}`
  - Necesario porque iTunes API no provee headers CORS

## 📱 Funcionalidades por Vista

### Vista Principal (`/`)

- Lista de 100 podcasts más populares
- Filtrado en tiempo real por nombre y autor
- Contador de resultados filtrados
- Navegación a detalle del podcast
- Cache automático de 24 horas

### Vista Detalle Podcast (`/podcast/{id}`)

- Sidebar con imagen, título, autor y descripción
- Lista de episodios con título, fecha y duración
- Navegación a detalle del episodio
- Enlaces en sidebar para volver al podcast

### Vista Detalle Episodio (`/podcast/{id}/episode/{id}`)

- Mismo sidebar que vista anterior
- Reproductor HTML5 nativo
- Título y descripción del episodio (HTML interpretado)
- Fecha de publicación del episodio

## 🎨 Diseño Responsive

### Breakpoints

- **Desktop**: > 768px (Grid completo, sidebar lateral)
- **Tablet**: 768px - 480px (Grid adaptado, sidebar arriba)
- **Mobile**: < 480px (Grid reducido, elementos apilados)

### Características Responsive

- Grid de podcasts adaptativo
- Sidebar que se convierte en header en móviles
- Tablas con columnas que se ocultan en pantallas pequeñas
- Tamaños de fuente y espaciados escalables

## 🧪 Testing

### Configuración

- **Jest** como test runner
- **jsdom** para environment de navegador
- **@testing-library/jest-dom** para matchers adicionales

### Tipos de Tests

- Tests unitarios de hooks
- Tests de componentes
- Tests de servicios
- Tests de utilidades

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📈 Mejoras Implementadas

### Performance

- Lazy loading de imágenes
- Cache inteligente con expiración
- Debounce implícito en filtrado (React state)
- Componentes optimizados con memo cuando necesario

### UX/UI

- Indicadores de carga en esquina superior derecha
- Estados de error amigables
- Navegación intuitiva con breadcrumbs visuales
- Hover effects y transiciones suaves

### Accesibilidad

- Elementos semánticamente correctos
- Labels y alt texts descriptivos
- Focus visible en elementos interactivos
- Textos de ayuda para lectores de pantalla

## 🔮 Posibles Mejoras Futuras

### Técnicas

- Implementar Service Workers para cache más avanzado
- Añadir Server-Side Rendering (Next.js)
- Integrar análisis de bundle size
- Implementar lazy loading de rutas

### Funcionales

- Favoritos de podcasts
- Historial de reproducción
- Búsqueda avanzada con filtros
- Modo offline completo
- Compartir episodios

### UX

- Player flotante que persiste entre vistas
- Tema oscuro/claro
- Velocidad de reproducción variable
- Subtítulos automáticos

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado como prueba técnica** - Demuestra competencias en React, TypeScript, Webpack, CSS, y arquitectura de aplicaciones modernas.
