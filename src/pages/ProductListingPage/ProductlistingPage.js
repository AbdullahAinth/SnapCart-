import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts, getCategories, getProductsByCategory } from '../../api/product';
import styles from './ProductListingPage.module.css';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        const categoriesData = await getCategories();
        setCategories(['All', ...categoriesData]); // Add 'All' option
      } catch (err) {
        setError("Failed to fetch products or categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    const filterProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts = [];
        if (selectedCategory && selectedCategory !== 'All') {
          fetchedProducts = await getProductsByCategory(selectedCategory);
        } else {
          fetchedProducts = await getProducts();
        }
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to fetch products for the selected category.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.listingPage}>
      <h1>Products</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input"
        />
        <select onChange={handleCategoryChange} value={selectedCategory} className="input">
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="input"
        />
      </div>
      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;