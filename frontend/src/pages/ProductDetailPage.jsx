import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import SEOHelmet from '@components/common/SEOHelmet';
import ProductSchema from '@components/seo/ProductSchema';
import BreadcrumbSchema from '@components/seo/BreadcrumbSchema';
import Breadcrumb from '@components/common/Breadcrumb';
import ImageGallery from '@components/product/ImageGallery';
import AddToCartSection from '@components/product/AddToCartSection';
import ReviewList from '@components/product/ReviewList';
import ReviewForm from '@components/product/ReviewForm';
import ProductCard from '@components/product/ProductCard';
import productService from '@services/product-service';
import reviewService from '@services/review-service';
import recommendationService from '@services/recommendation-service';

/**
 * ProductDetailPage Component - Street Style
 * Trang chi tiết sản phẩm
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  
  // State
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchReviews();
      fetchSimilarProducts();
    }
  }, [id]);

  // Page title is now handled by SEOHelmet component

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('CANNOT LOAD PRODUCT');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getProductReviews(id, {
        page: 0,
        size: 50,
      });
      
      if (response.success && response.data) {
        setReviews(response.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const response = await recommendationService.getSimilarProducts(id, 4);
      
      if (response.success && response.data) {
        setSimilarProducts(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching similar products:', err);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    setHasUserReviewed(true);
  };

  const handleReviewDeleted = () => {
    fetchReviews();
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Product images
  const productImages = [
    ...(product?.imageUrl ? [product.imageUrl] : []),
    ...(product?.additionalImages || [])
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Products', path: '/products' },
    ...(product?.categoryName 
      ? [{ label: product.categoryName, path: `/category/${product.categoryId}` }]
      : []
    ),
    { label: product?.name || 'Product', path: null },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-light-50">
        <div className="container-street py-6">
          <div className="animate-pulse space-y-8">
            {/* Breadcrumb skeleton */}
            <div className="h-6 bg-light-200 w-64"></div>
            
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-light-200"></div>
              <div className="space-y-6">
                <div className="h-12 bg-light-200 w-3/4"></div>
                <div className="h-8 bg-light-200 w-1/2"></div>
                <div className="h-32 bg-light-200"></div>
                <div className="h-48 bg-light-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State - Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center p-12 border-2 border-dark-950">
          <h1 className="text-6xl font-display font-black mb-4">404</h1>
          <p className="text-xl font-bold uppercase tracking-wide mb-6">
            PRODUCT NOT FOUND
          </p>
          <Link to="/products" className="btn-street">
            BACK TO PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags - Dynamic */}
      {product && (
        <>
          <SEOHelmet 
            title={`${product.name} - ${formatPrice(product.salePrice || product.price)} | D4K Store`}
            description={`Mua ${product.name} chính hãng tại D4K Store. ${product.description || `${product.name} - Thời trang streetwear chất lượng cao`}. Giá: ${formatPrice(product.salePrice || product.price)}. Giao hàng nhanh toàn quốc. Đổi trả dễ dàng trong 7 ngày. ${reviews.length > 0 ? `⭐ ${averageRating.toFixed(1)}/5 từ ${reviews.length} đánh giá` : ''}`}
            keywords={`${product.name}, mua ${product.name}, ${product.categoryName}, ${product.categoryName} streetwear, ${product.name} giá rẻ, ${product.name} chính hãng, d4k store, thời trang streetwear, y2k fashion`}
            image={product.imageUrl}
            url={`/product/${product.id}`}
            type="product"
            price={product.salePrice || product.price}
            currency="VND"
            availability={product.stockQuantity > 0 ? "in stock" : "out of stock"}
          />
          
          {/* Structured Data - Product Schema */}
          <ProductSchema 
            product={product}
            reviews={reviews}
            averageRating={averageRating}
            currency="VND"
          />
          
          {/* Structured Data - Breadcrumb Schema */}
          <BreadcrumbSchema items={breadcrumbItems} />
        </>
      )}
      
      <div className="min-h-screen bg-light-50">
        <div className="container-street py-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery 
              images={productImages} 
              productName={product.name} 
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.categoryName && (
              <Link
                to={`/category/${product.categoryId}`}
                className="inline-block px-4 py-1 border-2 border-dark-950 
                         text-xs font-bold uppercase tracking-widest
                         hover:bg-dark-950 hover:text-light-50 transition-all"
              >
                {product.categoryName}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight 
                         leading-tight glitch-street">
              {product.name}
            </h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-2xl">
                      {index < Math.round(averageRating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} REVIEWS)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="py-4 border-y-2 border-dark-950">
              {product.salePrice ? (
                <div className="space-y-2">
                  <div className="text-4xl font-black text-street-red">
                    {formatPrice(product.salePrice)}
                  </div>
                  <div className="text-xl font-bold text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </div>
                  <div className="inline-block px-3 py-1 bg-street-red text-light-50 
                                text-xs font-bold uppercase tracking-wider">
                    SALE
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-black text-dark-950">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  DESCRIPTION
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}


            {/* Add to Cart Section */}
            <AddToCartSection product={product} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12 border-t-2 border-dark-950">
          <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-8">
            CUSTOMER REVIEWS
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Review List */}
            <div>
              {reviewsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-6 border-2 border-dark-950">
                      <div className="h-6 bg-light-200 w-1/3 mb-3"></div>
                      <div className="h-20 bg-light-200"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  averageRating={averageRating}
                  onReviewDeleted={handleReviewDeleted}
                />
              )}
            </div>

            {/* Review Form */}
            <div>
              <ReviewForm
                productId={product.id}
                onReviewSubmitted={handleReviewSubmitted}
                hasExistingReview={hasUserReviewed}
              />
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="py-12 border-t-2 border-dark-950">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                YOU MIGHT ALSO LIKE
              </h2>
              <Link
                to="/products"
                className="text-sm font-bold uppercase tracking-wide hover:text-street-red 
                         transition-colors flex items-center space-x-2"
              >
                <span>VIEW ALL</span>
                <FiChevronRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;

