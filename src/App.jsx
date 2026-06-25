import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Home from '../src/pages/Home';
import CategoryPage from '../src/components/CategoryPage';

export default function App() {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('products').select('*');
      setAllProducts(data || []);
    }
    fetchData();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home allProducts={allProducts} />} />
          <Route path="/category/:categoryName" element={<CategoryPage allProducts={allProducts} />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}