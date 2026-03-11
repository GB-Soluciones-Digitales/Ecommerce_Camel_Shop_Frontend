# 🐫 Camel Shop - Frontend

Interfaz de usuario moderna y responsiva para la tienda online **Camel Moda Shop**. Desarrollada con **React 18** y **Tailwind CSS**, enfocada en brindar una experiencia de compra fluida (Mobile First) y un panel de administración potente para la gestión de un inventario complejo.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000)

---

## ✨ Funcionalidades

### 🛍️ Para el Cliente

- **Catálogo Inteligente:** Filtrado dinámico por categorías vía URL (SEO Friendly) y buscador en tiempo real.

- **Detalle Inmersivo:** Galería de imágenes tipo *slider* con miniaturas. Selector de variantes con lógica inteligente que deshabilita combinaciones de **Color / Talle** sin stock.

- **Carrito de Compras:** Gestionado con Context API. Persistencia local y agrupación de ítems por variante exacta (ej: Remera Gris M ≠ Remera Gris L).

- **Checkout vía WhatsApp:** Generación automática de un mensaje detallado con el pedido para finalizar la compra de forma ágil y personalizada.

---

### 🔐 Panel de Administración (Back-office)

- **Gestión Avanzada de Productos:** Matriz de stock visual para cargar múltiples variantes (Color y Talle) y cálculo automático del stock total.

- **Gestión de Pedidos:** Tablero de control con estados (*Pendiente, Enviado, Entregado, Cancelado*), modal de preparación y carga de comprobantes.

- **Personalización (CMS):** Configuración dinámica de banners e imágenes del Hero de la Home.

---

## 🛠️ Stack Tecnológico

- **Core:** React 18 + Vite
- **Estilos:** Tailwind CSS + Framer Motion
- **Estado Global:** React Context API
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **UI Components:** React Icons, Swiper
- **Despliegue:** Vercel

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

npm install --legacy-peer-deps
```

### 3️⃣ Configurar Variables de Entorno

Crear un archivo .env en la raíz del proyecto:
```bash
VITE_API_URL=https://tu-backend-production.up.railway.app/api
```

### 4️⃣ Ejecutar en entorno local

```bash
npm run dev
```

---

## 👤 Autor
**Brian Battauz** - *Full Stack Developer*
[Portfolio](https://portfoliobrianbattauz.vercel.app/) | [LinkedIn](www.linkedin.com/in/brian-battauz-75691a217)
