import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage({ allProducts }) {
  const { categoryName } = useParams();

  // Filter products based on the URL parameter
  const filteredProducts = allProducts.filter(item => 
    item.category === categoryName.toLowerCase()
  );

  return (
    <div className="p-10">
      <Link to="/" className="text-sm text-stone-500 underline">← Back to Home</Link>
      <h1 className="text-3xl font-bold capitalize mt-4">{categoryName}</h1>
      
      <div className="grid grid-cols-4 gap-6 mt-6">
        {filteredProducts.map(item => (
          <div key={item.id} className="border p-4 rounded-xl">
            <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
            <h2 className="font-bold">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}