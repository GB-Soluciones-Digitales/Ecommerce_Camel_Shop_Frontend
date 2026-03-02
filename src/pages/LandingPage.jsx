import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroSlider from '../components/Hero';

const LandingPage = () => {
  const categories = [
    { title: "Cápsula de Invierno", image: "https://images.unsplash.com/photo-1599703678443-4fdafa9e1d0a?q=80&w=1125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", slug: "abrigos", span: "md:col-span-2 md:row-span-2 h-[500px] md:h-[700px]" },
    { title: "Esenciales", image: "https://plus.unsplash.com/premium_photo-1664202526075-7436b5325ef3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", slug: "remeras", span: "h-[350px] md:h-auto" },
    { title: "Vestidos", image: "https://plus.unsplash.com/premium_photo-1673977132687-53990d8cc715?q=80&w=679&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", slug: "pantalones", span: "h-[350px] md:h-auto" }
  ];

  return (
    <div className="font-sans bg-crema min-h-screen">
      <Helmet><title>CAMEL | Moda y Estilo</title></Helmet>

      <HeroSlider />

      <section className="border-y border-brand-muted py-4 bg-crema">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap justify-center md:justify-between items-center gap-6 text-[10px] md:text-xs tracking-[0.2em] uppercase text-brand-primary">
          <span>Envíos a todo el país</span><span className="hidden md:inline">•</span>
          <span>Calidad Garantizada</span><span className="hidden md:inline">•</span>
          <span>Diseños Elegantes</span>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-crema">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-brand-dark tracking-tight">Descubre</h2>
              <p className="text-brand-primary mt-2 font-medium tracking-wide uppercase text-sm">Nuestras selecciones</p>
            </div>
            <Link to="/productos" className="border-b border-brand-dark text-brand-dark pb-1 text-sm font-bold uppercase tracking-widest hover:text-brand-primary hover:border-brand-primary transition-colors">
              Ver Catálogo Completo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to={`/productos?categoria=${cat.slug}`} className={`relative group overflow-hidden bg-brand-light ${cat.span} block rounded-sm`}>
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-8 md:p-10">
                  <h3 className="text-3xl md:text-4xl font-serif text-brand-light mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.title}</h3>
                  <div className="h-[1px] w-0 bg-brand-light group-hover:w-12 transition-all duration-500"></div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;