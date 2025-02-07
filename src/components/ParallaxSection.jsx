import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';

export const ParallaxSection = ({ children, speed = 1 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${100 * speed}%`]);

  return (
    <motion.div 
      style={{ y }} 
      className="parallax-section"
    >
      {children}
    </motion.div>
  );
};

ParallaxSection.propTypes = {
  children: PropTypes.node.isRequired,
  speed: PropTypes.number
};

export default ParallaxSection; 