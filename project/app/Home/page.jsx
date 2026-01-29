"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
      
      // Extract unique categories
      const cats = ['all', ...new Set(response.data.map(p => p.category))];
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Open product modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Add to cart
  const addToCart = () => {
    if (!selectedProduct) return;
    
    const existingItem = cart.find(item => item.id === selectedProduct.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedProduct, quantity, cartItemId: Date.now() }]);
    }
    
    // Show success feedback
    alert(`✅ "${selectedProduct.title}" added to cart!`);
    closeModal();
  };

  // Remove from cart
  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  // Update quantity in cart
  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart(cart.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">🛍️ Big mart Store</h1>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border text-white  placeholder-whte focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Main Content */}
          <div className={showCart ? "hidden md:flex md:flex-1 md:flex-col" : "flex-1"}>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">⏳</div>
                  <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden flex flex-col cursor-pointer"
                    >
                      {/* Product Image */}
                      <div
                        onClick={() => openProductModal(product)}
                        className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden hover:bg-gray-200 transition relative group"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity flex items-center justify-center">
                          <span className="text-white font-bold text-lg">👁️ View Details</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-gray-800 font-semibold line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-3 mt-auto">
                          <span className="text-2xl font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ⭐ {product.rating?.rate || 'N/A'}
                          </span>
                        </div>

                        <p className="text-gray-500 text-xs mb-4 capitalize">
                          {product.category}
                        </p>

                        <button
                          onClick={() => openProductModal(product)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95"
                        >
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-2xl text-gray-600">❌ No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="md:w-80 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
              
              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.cartItemId} className="border-b pb-4">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                              className="bg-gray-200 w-6 h-6 rounded hover:bg-gray-300"
                            >
                              −
                            </button>
                            <span className="font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                              className="bg-gray-200 w-6 h-6 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-red-600 text-sm hover:text-red-800 mt-2 font-semibold"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Tax (10%):</span>
                      <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">${(cartTotal * 1.1).toFixed(2)}</span>
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95">
                      💳 Checkout
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-2xl mb-2">🛒</p>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={closeModal}
                className="text-3xl text-gray-600 hover:text-gray-800 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Image */}
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="h-full w-full object-contain p-4"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {selectedProduct.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-blue-600">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-bold text-lg">
                      ⭐ {selectedProduct.rating?.rate || 'N/A'} ({selectedProduct.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6 capitalize">
                    <strong>Category:</strong> {selectedProduct.category}
                  </p>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="bg-gray-300 w-10 h-10 rounded font-bold text-lg hover:bg-gray-400"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-10 border-2 border-gray-300 rounded text-center font-bold text-lg focus:outline-none focus:border-blue-600"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="bg-gray-300 w-10 h-10 rounded font-bold text-lg hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={addToCart}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95"
                    >
                      ✓ Add to Cart
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
