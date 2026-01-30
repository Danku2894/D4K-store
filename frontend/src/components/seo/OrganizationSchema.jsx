import { Helmet } from 'react-helmet-async';

/**
 * OrganizationSchema Component
 * Structured Data (JSON-LD) cho Organization/Business
 * Nên đặt trong Header hoặc Layout chính
 */
const OrganizationSchema = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'D4K Store',
    url: 'https://www.web-apps.live',
    logo: 'https://www.web-apps.live/logo.png',
    description: 'Thời trang Streetwear & Y2K Fashion chính hãng tại Việt Nam',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
      addressLocality: 'Vietnam',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Vietnamese', 'English'],
    },
    sameAs: [
      // Add social media links if available
      // 'https://www.facebook.com/d4kstore',
      // 'https://www.instagram.com/d4kstore',
      // 'https://www.tiktok.com/@d4kstore',
    ],
    foundingDate: '2024',
    founder: {
      '@type': 'Organization',
      name: 'D4K Store',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema, null, 2)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
