/**
 * Dynamic Sitemap Generator for D4K Store
 * Fetches products and categories from API and generates sitemap.xml
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://www.web-apps.live';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

/**
 * Fetch data from API
 */
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return null;
  }
};

/**
 * Format date to ISO string
 */
const formatDate = (date) => {
  return new Date(date || Date.now()).toISOString().split('T')[0];
};

/**
 * Escape XML special characters
 */
const escapeXml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Generate sitemap XML
 */
const generateSitemap = async () => {
  console.log('🚀 Starting sitemap generation...\n');

  // Static pages
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/products', changefreq: 'daily', priority: '0.9' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.6' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  // Add static pages
  console.log('📄 Adding static pages...');
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${formatDate()}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });
  console.log(`✅ Added ${staticPages.length} static pages\n`);

  // Fetch and add categories
  console.log('📦 Fetching categories...');
  const categoriesResponse = await fetchData('/categories');
  if (categoriesResponse && categoriesResponse.data) {
    const categories = Array.isArray(categoriesResponse.data) 
      ? categoriesResponse.data 
      : categoriesResponse.data.content || [];
    
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(category => {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/category/${category.id}</loc>\n`;
      xml += `    <lastmod>${formatDate(category.updatedAt || category.createdAt)}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n\n';
    });
    console.log(`✅ Added ${categories.length} category pages\n`);
  } else {
    console.log('⚠️ No categories found or API error\n');
  }

  // Fetch and add products
  console.log('🛍️ Fetching products...');
  const productsResponse = await fetchData('/products?size=1000&page=0');
  if (productsResponse && productsResponse.data) {
    const products = Array.isArray(productsResponse.data) 
      ? productsResponse.data 
      : productsResponse.data.content || [];
    
    console.log(`✅ Found ${products.length} products`);
    products.forEach(product => {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/product/${product.id}</loc>\n`;
      xml += `    <lastmod>${formatDate(product.updatedAt || product.createdAt)}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      
      // Add product image
      if (product.imageUrl) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(product.imageUrl)}</image:loc>\n`;
        xml += `      <image:caption>${escapeXml(product.name)}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n\n';
    });
    console.log(`✅ Added ${products.length} product pages\n`);
  } else {
    console.log('⚠️ No products found or API error\n');
  }

  xml += '</urlset>';

  // Write to file
  try {
    fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${OUTPUT_PATH}\n`);
  } catch (error) {
    console.error('❌ Error writing sitemap file:', error.message);
    process.exit(1);
  }
};

// Run the generator
generateSitemap().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
