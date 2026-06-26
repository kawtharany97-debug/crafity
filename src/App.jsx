import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Home from '../src/pages/Home';
import CategoryPage from '../src/components/CategoryPage';
import LabelPage from '../src/components/LabelPage';


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
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home allProducts={allProducts} />} />
      <Route
        path="/category/:categoryName"
        element={<CategoryPage allProducts={allProducts} />}
      />
      <Route
        path="/label/:labelName"
        element={<LabelPage allProducts={allProducts} />}
      />
    </Routes>
  </BrowserRouter>
);
}