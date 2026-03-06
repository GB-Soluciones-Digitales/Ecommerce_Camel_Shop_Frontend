import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: delay }} 
    >
      {children}
    </motion.div>
  );
};

export default Reveal;