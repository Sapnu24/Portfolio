// src/components/SectionWrapper.jsx
import { motion } from "framer-motion";

const SectionWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}   // start faded + down
      whileInView={{ opacity: 1, y: 0 }} // animate when visible
      viewport={{ once: true, amount: 0.3 }} // trigger once, 30% in view
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;
