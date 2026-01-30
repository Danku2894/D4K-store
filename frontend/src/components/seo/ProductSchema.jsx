import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * ProductSchema Component
 * Structured Data (JSON-LD) cho Product Detail Page
 * Giúp Google hiển thị Rich Snippets với rating, price, availability
 */
const ProductSchema = ({
  product,
  reviews = [],
  averageRating = 0,
  currency = 'VND',
}) => {
  if (!product) return null;

  // Build product schema
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl ? [product.imageUrl] : [],
    description: product.description || `${product.name} - Streetwear chính hãng tại D4K Store`,
    sku: String(product.id),
    mpn: String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'D4K Store',
    },
    category: product.categoryName || 'Streetwear',
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : `https://www.web-apps.live/product/${product.id}`,
      priceCurrency: currency,
      price: product.salePrice || product.price,
      availability: product.stockQuantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'D4K Store',
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    },
  };

  // Add aggregate rating if reviews exist
  if (reviews.length > 0 && averageRating > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    };

    // Add individual reviews
    productSchema.review = reviews.slice(0, 5).map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.userName || review.userFullName || 'Anonymous',
      },
      datePublished: review.createdAt || new Date().toISOString(),
      reviewBody: review.comment || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema, null, 2)}
      </script>
    </Helmet>
  );
};

ProductSchema.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    stockQuantity: PropTypes.number,
    categoryName: PropTypes.string,
  }).isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
      userName: PropTypes.string,
      userFullName: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
  averageRating: PropTypes.number,
  currency: PropTypes.string,
};

export default ProductSchema;
