import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * WebPageSchema Component
 * Structured Data (JSON-LD) cho general web pages
 * Giúp Google hiểu cấu trúc page và content
 */
const WebPageSchema = ({
  name,
  description,
  url,
  breadcrumbItems = [],
  datePublished,
  dateModified,
  author = 'D4K Store',
}) => {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name,
    description: description,
    url: url || (typeof window !== 'undefined' ? window.location.href : 'https://www.web-apps.live'),
    inLanguage: 'vi-VN',
    isPartOf: {
      '@type': 'WebSite',
      name: 'D4K Store',
      url: 'https://www.web-apps.live',
    },
    publisher: {
      '@type': 'Organization',
      name: 'D4K Store',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.web-apps.live/logo.png',
      },
    },
  };

  // Add author if provided
  if (author) {
    webPageSchema.author = {
      '@type': 'Organization',
      name: author,
    };
  }

  // Add dates if provided
  if (datePublished) {
    webPageSchema.datePublished = datePublished;
  }
  if (dateModified) {
    webPageSchema.dateModified = dateModified;
  }

  // Add breadcrumb if provided
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    webPageSchema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
        .filter((item) => item.path)
        .map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: `https://www.web-apps.live${item.path}`,
        })),
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema, null, 2)}
      </script>
    </Helmet>
  );
};

WebPageSchema.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
  datePublished: PropTypes.string,
  dateModified: PropTypes.string,
  author: PropTypes.string,
};

export default WebPageSchema;
