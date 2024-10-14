
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

// This function runs server-side to fetch the product list initially
export async function getServerSideProps() {
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();

  return {
    props: {
      initialProducts: data.products,
    },
  };
}

const ProductList = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Can toggle to 'desc'

  // Fetch products based on search and sort
  const fetchProducts = async (query = '', order = 'asc') => {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${query}&sort=${order}`
    );
    const data = await response.json();
    setProducts(data.products);
  };

  // Debounce the search and fetch function
  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  // Trigger fetch whenever search or sort changes
  useEffect(() => {
    debouncedFetchProducts(searchQuery, sortOrder);
  }, [searchQuery, sortOrder]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle sorting order (asc/desc)
  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <h1>Product List</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search products..."
        style={{ marginBottom: '10px' }}
      />
      <button onClick={handleSortChange}>
        Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
      </button>
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id}>
              {product.title} - ${product.price}
            </li>
          ))
        ) : (
          <li>No products found</li>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
