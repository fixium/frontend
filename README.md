# Fixium - Frontend

## Tecnologías

Este proyecto utiliza las siguientes tecnologías:

- **[SvelteKit](https://kit.svelte.dev/):** Framework moderno para construir aplicaciones web rápidas y escalables.
- **[TailwindCSS](https://tailwindcss.com/):** Framework de utilidades CSS para un diseño rápido y eficiente.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **[Node.js](https://nodejs.org/):** Versión 16 o superior.
- **[npm](https://www.npmjs.com/):** Administrador de paquetes incluido con Node.js.

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/fixium/frontend.git
   cd fixium-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:5173](http://localhost:5173) (puerto predeterminado de Vite).

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera una versión optimizada para producción.
- `npm run preview`: Previsualiza la versión de producción.
- `npm run format`: Formatea el código con Prettier.
- `npm run lint`: Verifica el formato del código con Prettier.

## Estructura del proyecto

```
src/
├── lib/                # Componentes reutilizables y utilidades
├── routes/             # Rutas de la aplicación
├── app.css             # Estilos globales
├── app.html            # Plantilla HTML principal
static/                 # Archivos estáticos (imágenes, íconos, etc.)
```