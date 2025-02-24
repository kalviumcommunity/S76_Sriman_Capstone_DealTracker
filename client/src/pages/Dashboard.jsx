import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onClose }) => {
  const [view, setView] = useState("add");
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    rating: "",
    brand: "",
    description: "",
    platform: "",
    link: "",
  });

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.userId || user?.id || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      console.error("User ID or token is missing");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/track");
      return;
    }
    fetchUserProducts();
  }, [userId, token]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchUserProducts = async () => {
    try {
      console.log("Fetching products for userId:", userId);
      console.log("Using token:", token?.substring(0, 20) + "..."); // Log partial token for verification
      
      const response = await axios.get(`http://localhost:5001/api/products/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.length === 0) {
        console.log("No products found. Verify userId in database:", userId);
      } else {
        console.log("Fetched products:", response.data);
      }
      
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error);
      if (error.response?.status === 401) {
        console.log("Authentication error - token may be invalid");
      }
    }
  };
  

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product deleted successfully!");
      fetchUserProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      rating: product.rating,
      brand: product.brand,
      description: product.description,
      platform: product.platform,
      link: product.link,
    });
    setPreviewUrl(product.imageUrl);
    setView("edit");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updatedData = new FormData();
      Object.keys(formData).forEach(key => {
        updatedData.append(key, formData[key]);
      });

      if (selectedImage) {
        updatedData.append("image", selectedImage);
      }

      await axios.put(`http://localhost:5001/api/products/${editingProduct._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("Product updated successfully!");
      fetchUserProducts();
      setView("list");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  const handleBuyClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const newProductData = new FormData();
      
      // Log the actual userId being sent
      console.log("Creating product with userId:", userId);
      newProductData.append("userId", userId);
      
      // Log each field being added to FormData
      Object.keys(formData).forEach(key => {
        console.log(`Adding ${key}:`, formData[key]);
        newProductData.append(key, formData[key]);
      });
  
      if (selectedImage) {
        console.log("Adding image file:", selectedImage.name);
        newProductData.append("image", selectedImage);
      }
      
      // Log the complete FormData contents
      for (let pair of newProductData.entries()) {
        console.log('FormData content:', pair[0], pair[1]);
      }
  
      const response = await axios.post(`http://localhost:5001/api/products`, newProductData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Product creation response:", response.data);
      
      // Verify the created product has the correct userId
      if (response.data.userId !== userId) {
        console.warn("Created product userId mismatch!", {
          expectedUserId: userId,
          actualUserId: response.data.userId
        });
      }

      // Add a longer delay and multiple fetch attempts
      let attempts = 0;
      const maxAttempts = 3;
      
      const fetchWithRetry = async () => {
        try {
          await fetchUserProducts();
          const response = await axios.get(`http://localhost:5001/api/products/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.length === 0 && attempts < maxAttempts) {
            attempts++;
            console.log(`Retry attempt ${attempts} of ${maxAttempts}`);
            setTimeout(fetchWithRetry, 1000);
          }
        } catch (error) {
          console.error("Error in retry fetch:", error);
        }
      };

      await fetchWithRetry();

      alert("Product added successfully!");
      setView("list");
      
      // Reset form
      setFormData({
        name: "",
        price: "",
        rating: "",
        brand: "",
        description: "",
        platform: "",
        link: "",
      });
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert("Error adding product. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Main content */}
      <div className="relative bg-white rounded-lg w-3/4 h-4/5 flex shadow-lg">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col rounded-l-lg">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <button className="mt-4 p-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition-colors" onClick={() => setView("add")}>
            Add Product
          </button>
          <button className="mt-2 p-2 bg-green-500 rounded text-white hover:bg-green-600 transition-colors" onClick={() => setView("list")}>
            Your Products
          </button>
          <button className="mt-auto p-2 bg-red-500 rounded text-white hover:bg-red-600 transition-colors" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Main content area */}
        <div className="w-3/4 p-6 overflow-y-auto bg-gray-50 rounded-r-lg">
          {(view === "add" || view === "edit") && (
            <form onSubmit={view === "add" ? handleAddSubmit : handleUpdateSubmit} className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-white"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />

                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Drag and drop an image here, or click to select</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                  <input
                    key={key}
                    className="border p-2 rounded bg-white"
                    type={key === 'price' ? 'number' : 'text'}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                  />
                ))}
              </div>

              <button 
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                type="submit"
              >
                {view === "edit" ? "Update Product" : "Create Product"}
              </button>
            </form>
          )}

          {view === "list" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Products</h2>
              {products.length === 0 ? (
                <p>No products added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg p-4 shadow-lg">
                      <div className="relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                        <div className="absolute top-2 right-2">
                          <button 
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                            onClick={() => updateProduct(product)}
                          >
                            ✏️
                          </button>
                          <button 
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 ml-2"
                            onClick={() => deleteProduct(product._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <div className="flex items-center mt-2">
                          <span className="text-2xl font-bold">${product.price}</span>
                          <div className="ml-auto flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyClick(product.link)}
                          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <span>Buy Now</span>
                          <svg 
                            className="ml-2 w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;