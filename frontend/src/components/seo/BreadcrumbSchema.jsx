import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * BreadcrumbSchema Component
 * Structured Data (JSON-LD) cho Breadcrumb navigation
 * Giúp Google hiển thị breadcrumb trong search results
 */
const BreadcrumbSchema = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((item) => item.path) // Only include items with paths
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `https://www.web-apps.live${item.path}`,
      })),
  };

  // If no valid items, return null
  if (breadcrumbSchema.itemListElement.length === 0) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema, null, 2)}
      </script>
    </Helmet>
  );
};

BreadcrumbSchema.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
};

export default BreadcrumbSchema;
