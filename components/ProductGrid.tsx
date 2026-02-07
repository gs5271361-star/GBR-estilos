import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from "./ProductCard";
import { api } from '../services/api';
import { Product } from '../types';
import { staggerContainer } from '../lib/animations';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Carregando coleção...</div>;
  }

  return (
    <section className="py-20 px-6 md:px-12 bg-white dark:bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {products.filter(p => p.active).map((p) => (
            <React.Fragment key={p.id}>
              <ProductCard product={p} />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}