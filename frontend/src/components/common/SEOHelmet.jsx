import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEOHelmet Component
 * Component quản lý meta tags động cho SEO
 * Hỗ trợ Open Graph, Twitter Cards, và các meta tags chuẩn
 */
const SEOHelmet = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'D4K Store',
  locale = 'vi_VN',
  siteName = 'D4K Store',
  twitterCard = 'summary_large_image',
  // Product-specific props
  price,
  currency = 'VND',
  availability = 'in stock',
  // Additional meta
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  // Build full URL
  const fullUrl = url ? `https://www.web-apps.live${url}` : 'https://www.web-apps.live';
  const canonicalUrl = canonical || fullUrl;
  
  // Default image nếu không có
  const defaultImage = 'https://www.web-apps.live/logo.png';
  const ogImage = image || defaultImage;
  
  // Robots meta
  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@d4kstore" />
      <meta name="twitter:creator" content="@d4kstore" />

      {/* Product-specific Meta Tags (for e-commerce) */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
          <meta property="og:price:amount" content={price} />
          <meta property="og:price:currency" content={currency} />
        </>
      )}

      {/* Additional SEO Meta */}
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geo Tags (nếu là shop địa phương) */}
      <meta name="geo.region" content="VN" />
      <meta name="geo.placename" content="Vietnam" />
    </Helmet>
  );
};

SEOHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(['website', 'product', 'article', 'profile']),
  author: PropTypes.string,
  locale: PropTypes.string,
  siteName: PropTypes.string,
  twitterCard: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  availability: PropTypes.string,
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
  canonical: PropTypes.string,
};

export default SEOHelmet;
