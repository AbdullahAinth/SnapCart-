import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCardSkeleton from '../../components/ProductCardSkeleton/ProductCardSkeleton';
import { getProducts, getCategories, getProductsByCategory } from '../../api/product';
import styles from './ProductListingPage.module.css';
import HeroSection from '../../components/HeroSection/HeroSection';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (selectedCategory !== 'All') {
          result = await getProductsByCategory(selectedCategory, productsPerPage, (currentPage - 1) * productsPerPage);
        } else {
          result = await getProducts(productsPerPage, (currentPage - 1) * productsPerPage);
        }
        setProducts(result.products);
        setTotalProducts(result.total);

        const categoriesData = await getCategories();
        const filteredCategories = categoriesData.filter(c => typeof c === 'string');
        setCategories(['All', ...filteredCategories]);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.listingPage}>
      <HeroSection />
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
          {categories.map((category) => (
            <option key={category} value={category}>
              {typeof category === 'string'
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : 'Unknown'}
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

      {loading ? (
        <div className={styles.productlist}>
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className={styles.productlist}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>No products found matching your criteria.</p>
      )}
    </div>
  );
};

export default ProductListingPage;
