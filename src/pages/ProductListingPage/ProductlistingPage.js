import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCardSkeleton from '../../components/ProductCardSkeleton/ProductCardSkeleton';
import { getProducts, getCategories, getProductsByCategory } from '../../api/product';
import styles from './ProductListingPage.module.css';
import HeroSection from '../../components/HeroSection/HeroSection';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
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
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const renderPageButtons = () => {
    const buttons = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </button>
      );
    }

    return buttons;
  };

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
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo; Prev
            </button>

            {renderPageButtons()}

            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      ) : (
        <p>No products found matching your criteria.</p>
      )}
    </div>
  );
};

export default ProductListingPage;
