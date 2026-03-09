import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="will-change-transform transform-gpu" 
    >
      {children}
    </motion.div>
  );
};

export default Reveal;