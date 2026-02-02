import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import HeroSlider from '../components/Hero';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  return (
    <div className="font-sans bg-[#f9f5f0]">
      <Helmet>
        <title>Inicio | Camel Shop - Estilo Urbano Premium</title>
        <meta name="description" content="Descubrí la nueva colección 2026 de Camel Shop. Remeras oversize, jeans, calzado y accesorios con la mejor calidad y envío a todo el país." />
        <meta name="keywords" content="moda urbana, ropa hombre, oversize, argentina, streetwear" />
      </Helmet>

      <HeroSlider />

      <section className="py-16 bg-f9f5f0 border-t border-[#4a3b2a]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Envío Rápido", desc: "Despachamos en 24hs a todo el país." },
            { title: "Calidad Premium", desc: "Telas seleccionadas y confección detallada." },
            { title: "Compra Segura", desc: "Tus datos protegidos con los más altos estándares." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl hover:bg-[#f9f5f0] transition-colors duration-300">
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
    </div>
  );
};

export default LandingPage;