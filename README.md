# 🥖 Gestión de Ventas de Pan

Aplicación web full-stack diseñada para optimizar y controlar la producción, venta y entrega de pan casero. Construida con tecnologías modernas para garantizar rapidez y fluidez en la experiencia de usuario.

## ✨ Características Principales

- **Dashboard Unificado**: Visualización en tiempo real de todos los pedidos mediante tarjetas dinámicas e interactivas.
- **Gestión de Estados**: Flujo de trabajo de 4 pasos para cada pedido (`Pedido` -> `En Proceso` -> `Terminado` -> `Entregado`).
- **Resumen de Producción**: Contador automático e inteligente que suma exclusivamente los panes que deben amasarse y cocinarse.
- **Control Financiero**: Módulo de gastos (`Gastos`) integrado para registrar las compras de materia prima, categorizado por responsable.
- **Sistema de Envío**: Diferenciación entre "Retiro" y "Envío", con asignación de costos de delivery y accesos directos de WhatsApp para contactar al cliente.
- **Autenticación Rápida**: "Mini Login" basado en selección rápida para Anto y Cami.

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS.
- **Animaciones:** GSAP y Lenis para scroll suave y microinteracciones.
- **Iconografía:** Lucide React.
- **Backend:** Next.js Server Actions.
- **Base de Datos:** PostgreSQL alojado en [Supabase](https://supabase.com/).
- **ORM:** [Prisma](https://www.prisma.io/) con `@prisma/adapter-pg` y Connection Pooling (`pg`).

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Anto-Lezcano/gestion_ventas_pan.git
   cd gestion_ventas_pan
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto y agregar las credenciales de Supabase:
   ```env
   DATABASE_URL="postgresql://[USUARIO]:[CONTRASEÑA]@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://[USUARIO]:[CONTRASEÑA]@aws-1-us-west-2.pooler.supabase.com:5432/postgres"
   ```

4. Sincronizar la base de datos:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abrir en el navegador [http://localhost:3000](http://localhost:3000).

---
*Desarrollado con ❤️ para optimizar la panadería de Anto y Cami.*
