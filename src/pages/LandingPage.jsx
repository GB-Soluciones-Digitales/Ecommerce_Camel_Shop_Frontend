import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import HeroSlider from '../components/Hero';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  const categories = [
  {
    title: "Remeras",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
    slug: "remeras"
  },
  {
    title: "Pantalones",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800",
    slug: "pantalones"
  },
  {
    title: "Buzos", 
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800",
    slug: "buzos"
  }
];

  return (
    <div className="font-sans bg-[#f9f5f0]">
      <Helmet>
        <title>Inicio | Camel Shop - Estilo Urbano Premium</title>
      </Helmet>

      <HeroSlider />

      <section className="py-16 bg-[#f9f5f0] border-t border-[#4a3b2a]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Envío Rápido", desc: "Despachamos en 24hs a todo el país." },
            { title: "Calidad Premium", desc: "Telas seleccionadas y confección detallada." },
            { title: "Compra Segura", desc: "Tus datos protegidos con los más altos estándares." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4">
              <div className="bg-[#d8bf9f]/30 p-3 rounded-full text-[#4a3b2a]">
                <FiCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4a3b2a]">{item.title}</h3>
                <p className="text-[#4a3b2a]/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={`/productos?categoria=${cat.slug}`} 
              className="relative h-[600px] group overflow-hidden"
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4 drop-shadow-md">
                  {cat.title}
                </h2>
                <div className="flex items-center gap-2 bg-[#d8bf9f] text-[#4a3b2a] px-6 py-3 rounded-full font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  VER COLECCIÓN <FiArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;