import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import Home from '../src/pages/Home';
import CategoryPage from '../src/components/CategoryPage';
import LabelPage from '../src/components/LabelPage';
import ProductPage from '../src/components/ProductPage';


export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [lang, setLang] = useState("English");

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
  <Route
    path="/"
    element={
      <Home
        allProducts={allProducts}
        lang={lang}
        setLang={setLang}
      />
    }
  />

  <Route
    path="/category/:categoryName"
    element={
      <CategoryPage
        allProducts={allProducts}
        lang={lang}
        setLang={setLang}
      />
    }
  />

  <Route
    path="/label/:labelName"
    element={
      <LabelPage
        allProducts={allProducts}
        lang={lang}
        setLang={setLang}
      />
    }
  />

  <Route
    path="/product/:productId"
    element={
      <ProductPage
        allProducts={allProducts}
        lang={lang}
        setLang={setLang}
      />
    }
  />
</Routes>
  </BrowserRouter>
);
}