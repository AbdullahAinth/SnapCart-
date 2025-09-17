// src/pages/ProductListingPage/ProductlistingPage.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCardSkeleton from '../../components/ProductCardSkeleton/ProductCardSkeleton';
import { getProducts, getCategories, getProductsByCategory } from '../../api/product';
import styles from './ProductListingPage.module.css';
import HeroSection from '../../components/Hero/HeroSection';
// Import the global Product type from src/types.ts
import { Product } from '../../types';
// Import the useUser hook
import { useUser } from '../../context/UserContext';

const ProductListingPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  // Use the useUser hook to get the login state and user name
  const { isLoggedIn, userName } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (selectedCategory !== 'All') {
          result = await getProductsByCategory(selectedCategory, 1000, 0);
        } else {
          result = await getProducts(1000, 0);
        }
        setAllProducts(result.products || []);

        const categoriesData = await getCategories();
        const filteredCategories = categoriesData.filter((c: unknown) => typeof c === 'string') as string[];
        setCategories(['All', ...filteredCategories]);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products or categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

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
      {/* Conditionally render the welcome message */}
      {isLoggedIn ? (
        <h1 className={styles.welcomeMessage}>Welcome, {userName}!</h1>
      ) : (
        <h1>Products</h1>
      )}

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
      ) : paginatedProducts.length > 0 ? (
        <>
          <div className={styles.productlist}>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo; Prev
            </button>

            {renderPageButtons()}

            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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