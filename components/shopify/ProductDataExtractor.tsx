// ProductDataExtractor.tsx
import React, { useEffect, useState } from 'react';

// Define types for product data
interface Variant {
  id: number;
  title: string;
  price: string;
}

interface Product {
  id: number;
  title: string;
  handle: string;
  variants: Variant[];
}

interface ProductResponse {
  product: Product;
}

const ProductDataExtractor: React.FC<{ handle: string }> = ({ handle }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://usa-rs.com/products/${handle}.json`);
        if (!response.ok) {
          throw new Error(`Error fetching product data: ${response.statusText}`);
        }

        const data: ProductResponse = await response.json();
        setProduct(data.product);

        // Set the product data in a cookie for later use
        document.cookie = `product_data=${encodeURIComponent(
          JSON.stringify({
            handle: data.product.handle,
            title: data.product.title,
            variants: data.product.variants.map((variant: Variant) => ({
              title: variant.title,
              price: variant.price,
            })),
          })
        )}; path=/; max-age=3600; samesite=Lax`;

        console.log('Fetched and stored product data:', data.product);
      } catch (err: any) {
        console.error('Error fetching product data:', err);
        setError(err.message);
      }
    };

    fetchProductData();
  }, [handle]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      {/* Display more details as needed */}
    </div>
  );
};

export default ProductDataExtractor;
