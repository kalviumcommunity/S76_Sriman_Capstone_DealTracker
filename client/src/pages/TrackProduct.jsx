import  { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import image2 from "../images/Ellipse 1.png";
import image3 from "../images/Ellipse 3.png";
import image1 from "../images/Ellipse 1.png";
import pic1 from "../images/pic1.png";
import pic2 from "../images/pic2.png";
import SearchAutocomplete from '../components/SearchAutocomplete';
import noImage from "../images/dummy.png";

const TrackProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [comparisonData, setComparisonData] = useState(null); // State for comparison data
  const [showComparisonModal, setShowComparisonModal] = useState(false); // State to toggle modal
  const productsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/all`);
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  

  // Calculate the products to display on the current page
  const startIndex = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle navigation
  const handleNextPage = () => {
    if (startIndex + productsPerPage < filteredProducts.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    let filtered = products;

    if (filterType === "price" && value) {
      filtered = filtered.filter((product) => product.price <= value);
    }

    if (filterType === "rating" && value) {
      filtered = filtered.filter((product) => product.rating >= value);
    }

    if (filterType === "brand" && value) {
      filtered = filtered.filter((product) => product.platform.toLowerCase() === value.toLowerCase());
    }

    setFilteredProducts(filtered);
    setCurrentPage(0); 
  };

  // Handle Compare Button Click
  const handleCompareClick = (product) => {
    if (product.comparison) {
      setComparisonData(product);
      setShowComparisonModal(true);
    }
  };

  return (
    <div className="flex flex-col gap-16 mb-20 relative">
      {/* Background Images */}
      <Suspense fallback={<div className='text-white'>Loading...</div>}>
        <img
          src={image2}
          alt="Half Circle"
          className="absolute top-[400px] right-[-100px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h-[883px]"
        />
        <img
          src={image3}
          alt="Half Circle"
          className="absolute top-[1100px] right-[-360px] transform translate-x-1/2 -translate-y-1/2 w-[1128px] h-[1032px] opacity-50"
        />
        <img
          src={image1}
          alt="Half Circle"
          className="absolute top-[800px] left-[-1050px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h[883px] opacity-50"
        />
      </Suspense>

      <div className="flex items-center justify-between pt-12">
        <div className="w-1/2 relative flex flex-col gap-8">
          <div className="flex justify-end mr-[30px]">
            <img
              src={pic1}
              alt="pic1"
              className="w-49 h-40 object-contain"
            />
          </div>
          <div className="flex justify-start ml-[90px]">
            <img
              src={pic2}
              alt="pic2"
              className="w-49 h-42 object-contain"
            />
          </div>
        </div>
        <div className="w-1/2 text-right">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Analyse prices,
            <br />
            discover
            <br />
            the best deals
          </h1>
          <p className="text-gray-300 text-lg">
            Track a products price history and visualize
            <br />
            trends instantly.
            <br />
            Unlock the best offers at the right time
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
<div className="w-full max-w-3xl mx-auto mt-8">
  <h2 className="text-white text-center mb-4"></h2>
  {/* Search Bar */}
  <div className="relative">
    <SearchAutocomplete
      products={products}
      setFilteredProducts={setFilteredProducts}
    />
    <svg
      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>

    {/* Filter Buttons */}
    <div className="flex gap-6 justify-center mt-6">
    {/* Price Filter */}
    <div className="relative">
      <select
        onChange={(e) => handleFilterChange("price", Number(e.target.value))}
        className="px-4 py-2 w-36 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white text-center appearance-none hover:bg-opacity-60 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA]"
      >
        <option value="" className="text-center">Price ▼</option>
        <option value="10">Up to $10</option>
        <option value="1000">Up to $1000</option>
        <option value="100000">Up to $100000</option>
      </select>
    </div>

    {/* Rating Filter */}
    <div className="relative">
      <select
        onChange={(e) => handleFilterChange("rating", Number(e.target.value))}
        className="px-4 py-2 w-36 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white text-center appearance-none hover:bg-opacity-60 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA]"
      >
        <option value="" className="text-center">Ratings ▼</option>
        <option value="3">3 Stars & Above</option>
        <option value="4">4 Stars & Above</option>
        <option value="5">5 Stars</option>
      </select>
    </div>

    {/* Brand Filter */}
    <div className="relative">
      <select
        onChange={(e) => handleFilterChange("brand", e.target.value)}
        className="px-4 py-2 w-36 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white text-center appearance-none hover:bg-opacity-60 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA]"
      >
        <option value="" className="text-center">Brand ▼</option>
        <option value="Amazon">Amazon</option>
        <option value="Flipkart">Flipkart</option>
        <option value="Snapdeal">Snapdeal</option>
      </select>
    </div>
  </div>

  {/* Product Grid */}
  <div className="grid grid-cols-2 gap-6 mt-8">
  {currentProducts.map((product , index) => (
    <div key={product.id || `${product.name}-${index}`} className="bg-[#5C6394] bg-opacity-40 rounded-lg p-4">
      <div className="relative">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
        <img
          src={product.imageUrl || {noImage}}
          alt={product.name}
          className="h-48 w-full object-cover rounded-lg mb-4"
        />
        </Suspense>
        <button className="absolute top-2 right-2 text-white hover:text-[#4AA3BA]">
          ♥
        </button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-white">${product.price}</span>
          <span className="text-white bg-[#1A1A3F] bg-opacity-50 px-2 py-1 rounded">
            ⭐ {product.rating || "N/A"}
          </span>
        </div>
        <button
          className="w-full bg-[#FF0051] text-white py-2 rounded-lg hover:bg-opacity-90"
          onClick={() => handleCompareClick(product)}
        >
          Compare
        </button>
      </div>
      </div>
    ))}
  </div>

  {/* Pagination Controls */}
  <div className="flex justify-center items-center mt-8 gap-4">
    <button
      onClick={handlePreviousPage}
      disabled={currentPage === 0}
      className={`px-4 py-2 rounded-full ${currentPage === 0 ? 'bg-gray-500' : 'bg-[#4AA3BA]'} text-white`}
    >
      ←
    </button>
    <button
      onClick={handleNextPage}
      disabled={startIndex + productsPerPage >= filteredProducts.length}
      className={`px-4 py-2 rounded-full ${startIndex + productsPerPage >= filteredProducts.length ? 'bg-gray-500' : 'bg-[#4AA3BA]'} text-white`}
    >
      →
    </button>
  </div>
 </div>

      {/* Comparison Modal */}
      {showComparisonModal && comparisonData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-purple-300 rounded-lg w-full max-w-md mx-auto">
      {/* Centered Title */}
      <div className="p-3 text-center">
        <h2 className="text-2xl font-bold text-white">{comparisonData.name}</h2>
        <button
          onClick={() => setShowComparisonModal(false)}
          className="absolute top-3 right-3 text-lg font-bold text-gray-500"
        >
          X
        </button>
      </div>
      
      {/* Image Section - Centered with no background */}
      <div className="p-2 mx-auto text-center mb-2">
        <div className="relative inline-block">
          <img
            src={comparisonData.imageUrl}
            alt={comparisonData.name}
            className="h-36 sm:h-44 object-cover rounded-lg"
          />
          <button className="absolute top-1 right-1 text-yellow-500 text-lg">
            ♥
          </button>
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="grid grid-cols-3 gap-px mx-3 mb-3 bg-white rounded-lg overflow-hidden">
        {/* Headers */}
        {comparisonData.comparison.map((platformData, index) => (
          <div key={`platform-${index}`} className="bg-purple-300 p-2 text-center">
            <h3 className="text-base font-bold">{platformData.platform}</h3>
          </div>
        ))}
        
        {/* Prices */}
        {comparisonData.comparison.map((platformData, index) => (
          <div key={`price-${index}`} className="bg-purple-300 p-2 text-center">
            <p className="text-lg font-bold">${platformData.price}</p>
          </div>
        ))}
        
        {/* Discounts */}
        {comparisonData.comparison.map((platformData, index) => (
          <div key={`discount-${index}`} className="bg-purple-300 p-2 text-center">
            <p className="text-lg font-bold">{platformData.discount}%</p>
          </div>
        ))}
        
        {/* Ratings */}
        {comparisonData.comparison.map((platformData, index) => (
          <div key={`rating-${index}`} className="bg-purple-300 p-2 text-center">
            <p className="text-base text-yellow-400">
              {"★".repeat(Math.floor(platformData.rating))}
            </p>
          </div>
        ))}
        
        {/* Buy Now Buttons */}
        {comparisonData.comparison.map((platformData, index) => (
          <div key={`buy-${index}`} className="bg-purple-300 p-2 text-center">
            <a
              href={platformData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold inline-block"
            >
              Buy Now
            </a>
          </div>
        ))}
      </div>
      
      {/* Go Back Button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setShowComparisonModal(false)}
          className="bg-red-500 text-white rounded-full px-8 py-2 text-base font-bold"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TrackProduct;