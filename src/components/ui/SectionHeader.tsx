"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  children?: ReactNode;
}

const SectionHeader = ({ tag, title, subtitle, light }: SectionHeaderProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center mb-6 md:mb-8"
    >
      {tag && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${light ? "bg-orange/20 text-orange" : "bg-orange/10 text-orange"}`}>
          {tag}
        </span>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${light ? "text-navy-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base max-w-2xl mx-auto ${light ? "text-navy-foreground/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;

