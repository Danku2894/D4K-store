import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useCartStore from '@store/use-cart-store';
import useWishlistStore from '@store/use-wishlist-store';
import authService from '@services/auth-service';
import productService from '@services/product-service';
import logo from '../../assets/images/d4k-logo.png';

/**
 * Header Component - Y2K Style
 * Navigation bar với search, cart, wishlist icons
 */
const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  
  // Cart & Wishlist state
  const totalItems = useCartStore((state) => state.totalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const wishlistItems = useWishlistStore((state) => state.items);

  // Check authentication status
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('d4k-auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('d4k-auth-change', handleAuthChange);
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    clearCart();
    useWishlistStore.getState().clearWishlist();
    setUser(null);
    setShowUserDropdown(false);
    navigate('/');
    toast.success('LOGGED OUT SUCCESSFULLY!', {
      icon: '👋',
      style: {
        background: '#000000',
        color: '#ffffff',
        border: '2px solid #000000',
        fontWeight: 'bold',
      },
    });
  };

  /* Suggestions Logic */
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        const fetchSuggestions = async () => {
          try {
            const response = await productService.searchProducts(searchQuery, { size: 5 });
            setSuggestions(response.data?.content || []);
            setShowSuggestions(true);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSuggestionClick = (productId) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute top-full left-0 w-full bg-light-50 border-2 border-dark-950 mt-1 shadow-street z-[60]">
        {suggestions.map((product) => (
          <div 
            key={product.id}
            onMouseDown={() => handleSuggestionClick(product.id)}
            className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
          >
            <div className="flex items-center flex-1 min-w-0 mr-4">
              <img 
                src={product.imageUrl || 'https://placehold.co/48x48?text=No+Img'} 
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=No+Img'; }}
                className="w-12 h-12 object-cover border border-dark-950 mr-4 shrink-0"
              />
              <p className="text-base font-bold text-dark-950 truncate uppercase">{product.name}</p>
            </div>
            <p className="text-sm text-street-red font-bold whitespace-nowrap flex-shrink-0">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-light-50 border-b-4 border-dark-950">
      <div className="container-street">
        {/* Main Header */}
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="D4K Logo" 
              className="h-10 md:h-14 object-contain scale-[1.75] origin-center hover:scale-[1.85] transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider text-sm"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider text-sm"
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider text-sm"
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className="text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider text-sm"
            >
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="SEARCH..."
                className="w-full px-4 py-2 pr-10 bg-light-100 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-500 focus:outline-none focus:border-street-red 
                         transition-all uppercase text-sm font-bold tracking-wide"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-950 hover:text-street-red transition-colors"
              >
                <FiSearch size={20} />
              </button>
            </form>
            {renderSuggestions()}
          </div>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative group"
              aria-label="Wishlist"
            >
              <FiHeart 
                size={24} 
                className="text-dark-950 group-hover:text-street-red transition-colors" 
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-street-red text-light-50 text-xs 
                               w-5 h-5 flex items-center justify-center font-bold border-2 border-dark-950">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative group"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart 
                size={24} 
                className="text-dark-950 group-hover:text-street-red transition-colors" 
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-dark-950 text-light-50 text-xs 
                               w-5 h-5 flex items-center justify-center font-bold border-2 border-dark-950">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
            >
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="group flex items-center space-x-2"
                aria-label="User Menu"
              >
                <FiUser 
                  size={24} 
                  className="text-dark-950 group-hover:text-street-red transition-colors" 
                />
                {user && (
                  <span className="text-sm font-bold uppercase tracking-wide text-dark-950 
                                 group-hover:text-street-red transition-colors">
                    {user.fullName?.split(' ')[0] || 'USER'}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-light-50 border-2 border-dark-950 
                              shadow-street z-50 animate-fadeIn">
                  {user ? (
                    /* Logged In Menu */
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b-2 border-dark-950">
                        <p className="text-sm font-black uppercase tracking-wide text-dark-950 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-600 font-medium truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 
                                 hover:bg-dark-950 hover:text-light-50 transition-all
                                 text-sm font-bold uppercase tracking-wide"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FiSettings size={18} />
                        <span>MY PROFILE</span>
                      </Link>

                      <Link
                        to="/profile/orders"
                        className="flex items-center space-x-3 px-4 py-3 
                                 hover:bg-dark-950 hover:text-light-50 transition-all
                                 text-sm font-bold uppercase tracking-wide"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FiShoppingCart size={18} />
                        <span>MY ORDERS</span>
                      </Link>

                      <div className="border-t-2 border-dark-950"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 
                                 hover:bg-street-red hover:text-light-50 transition-all
                                 text-sm font-bold uppercase tracking-wide text-left"
                      >
                        <FiLogOut size={18} />
                        <span>LOGOUT</span>
                      </button>
                    </div>
                  ) : (
                    /* Not Logged In Menu */
                    <div className="py-2">
                      <Link
                        to="/login"
                        className="block px-4 py-3 hover:bg-dark-950 hover:text-light-50 
                                 transition-all text-sm font-bold uppercase tracking-wide"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        LOGIN
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 hover:bg-street-red hover:text-light-50 
                                 transition-all text-sm font-bold uppercase tracking-wide"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        REGISTER
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-dark-950 hover:text-street-red transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4 relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="SEARCH..."
              className="w-full px-4 py-2 pr-10 bg-light-100 border-2 border-dark-950 
                       text-dark-950 placeholder-gray-500 focus:outline-none focus:border-street-red 
                       transition-all uppercase text-sm font-bold tracking-wide"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-950 hover:text-street-red transition-colors"
            >
              <FiSearch size={20} />
            </button>
          </form>
          { renderSuggestions() }
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-light-100 border-t-2 border-dark-950">
          <nav className="container-street py-4 space-y-4">
            <Link 
              to="/" 
              onClick={toggleMenu}
              className="block text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider py-2"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={toggleMenu}
              className="block text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider py-2"
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              onClick={toggleMenu}
              className="block text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider py-2"
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              onClick={toggleMenu}
              className="block text-dark-950 hover:text-street-red transition-colors font-bold uppercase tracking-wider py-2"
            >
              About
            </Link>
            
            {/* Mobile Icons */}
            <div className="flex items-center space-x-6 pt-4 border-t-2 border-dark-950">
              <Link 
                to="/wishlist" 
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-dark-950 hover:text-street-red transition-colors font-bold"
              >
                <FiHeart size={20} />
                <span>Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link 
                to="/cart" 
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-dark-950 hover:text-street-red transition-colors font-bold"
              >
                <FiShoppingCart size={20} />
                <span>Cart ({totalItems})</span>
              </Link>
              <Link 
                to="/profile" 
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-dark-950 hover:text-street-red transition-colors font-bold"
              >
                <FiUser size={20} />
                <span>Profile</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

