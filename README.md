# 🐫 Camel Shop - Frontend

Interfaz de usuario moderna y responsiva para la tienda de indumentaria **Camel Shop**.  
Desarrollada con **React** y **Tailwind CSS**, enfocada en brindar una experiencia de compra fluida (*Mobile First*) y un panel de administración potente para la gestión de inventario complejo.

---

## ✨ Funcionalidades

### 🛍️ Para el Cliente

- **Catálogo Inteligente**  
  Filtrado dinámico por categorías vía URL (*SEO Friendly*) y buscador en tiempo real.

- **Detalle de Producto Inmersivo**
  - Galería de imágenes tipo *slider* con miniaturas.
  - Selector de variantes con lógica inteligente que deshabilita combinaciones de **Color / Talle** sin stock.

- **Carrito de Compras (Context API)**  
  Persistencia local y agrupación de ítems por variante única  
  *(ej: Remera Gris M ≠ Remera Gris L)*.

- **Checkout vía WhatsApp**  
  Generación automática de un mensaje detallado con el pedido para finalizar la compra de forma personalizada.

---

## 🔐 Panel de Administración (Back-office)

- **Autenticación Segura**  
  Login contra API desarrollada en Java con Spring Security y JWT.

- **Gestión Avanzada de Productos**
  - Matriz de stock visual para cargar múltiples variantes (Color y Talle).
  - Cálculo automático del stock total.
  - Subida de imágenes con previsualización.

- **Gestión de Pedidos**
  - Tablero de control con estados: *Pendiente*, *Enviado* y *Entregado*.
  - Modal de preparación de pedidos.
  - Carga de comprobantes y facturas.

- **Hero Slider**
  - Configuración dinámica de banners de la Home desde el panel de administración.

---

## 🛠️ Stack Tecnológico

- **Core:** React 18 + Vite
- **Estilos:** Tailwind CSS + Framer Motion
- **Routing:** React Router DOM v6 (manejo de Query Params)
- **HTTP Client:** Axios (interceptores para tokens JWT)
- **UI Components:** React Icons, Swiper (carousels)
- **Estado Global:** React Context API

---

## 🚀 Instalación y Uso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Brian13b/Ecommerce_Camel_Shop_Frontend.git
cd Ecommerce_Camel_Shop_Frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install

# En caso de conflictos por dependencias legacy
npm install --legacy-peer-deps
```

### 3️⃣ Configurar Variables de Entorno

Crear un archivo .env en la raíz del proyecto:
```bash
# URL del Backend (Local o Producción en Railway)
VITE_API_URL=https://tu-backend-production.up.railway.app/api
```

### 4️⃣ Ejecutar en entorno local

```bash
npm run dev
```

---

## 📱 Diseño y UX

El diseño sigue una paleta de colores Tierra / Urbano:

Camel Oscuro: #4a3b2a

Arena: #d8bf9f

Se priorizó la experiencia Mobile First, con botones grandes, navegación intuitiva y feedback visual constante mediante loaders y skeletons.

---

## 🌐 Despliegue

El frontend está optimizado para su despliegue en Vercel.

Requiere un archivo vercel.json para el correcto manejo de rutas en SPAs (Single Page Applications).

---

## 👤 Autor

Brian Battauz
2026

---