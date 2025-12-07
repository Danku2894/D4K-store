import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '@services/category-service';
import { toast } from 'react-hot-toast';
import { 
  FiTrendingUp, 
  FiStar, 
  FiZap, 
  FiHeart,
  FiShoppingBag,
  FiFeather 
} from 'react-icons/fi';

/**
 * CategoriesSection Component
 * Hiển thị danh mục sản phẩm với icons
 */
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping cho categories (dựa vào tên)
  const categoryIcons = {
    default: FiShoppingBag,
    trending: FiTrendingUp,
    featured: FiStar,
    new: FiZap,
    favorite: FiHeart,
    accessories: FiFeather,
  };

  // Gradient colors cho từng category
  const categoryGradients = [
    'from-y2k-pink to-y2k-purple',
    'from-y2k-blue to-y2k-green',
    'from-y2k-purple to-y2k-blue',
    'from-y2k-orange to-y2k-pink',
    'from-y2k-green to-y2k-blue',
    'from-y2k-yellow to-y2k-orange',
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Lấy parent categories (top-level)
      const response = await categoryService.getAllCategories();
      
      if (response.success && response.data) {
        // Lấy tối đa 6 categories để hiển thị
        setCategories(response.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (name.includes(key)) {
        return Icon;
      }
    }
    return categoryIcons.default;
  };

  return (
    <section className="py-16">
      <div className="container-y2k">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 glitch-street">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Explore our curated collections
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass-street p-6 animate-pulse">
                <div className="w-16 h-16 bg-light-200 mx-auto mb-4"></div>
                <div className="h-6 bg-light-200 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = getIcon(category.name);
              const gradient = categoryGradients[index % categoryGradients.length];
              
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="glass-street p-6 text-center group hover:scale-105 
                           transition-all duration-300 hover:shadow-street animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 bg-dark-950 border-2 border-dark-950
                                flex items-center justify-center group-hover:bg-street-red 
                                transition-all duration-300`}>
                    <Icon size={32} className="text-light-50" />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-dark-950 font-bold text-lg uppercase group-hover:text-street-red 
                               transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {/* Description (if available) */}
                  {category.description && (
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Categories Button */}
        {!loading && categories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 text-dark-950 hover:text-street-red 
                       transition-colors font-bold text-lg uppercase tracking-wide group"
            >
              <span>View All Categories</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-bold uppercase">No categories available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;

