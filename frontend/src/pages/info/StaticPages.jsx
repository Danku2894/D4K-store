import StaticInfoPage from '@components/common/StaticInfoPage';

export const ShippingPage = () => (
  <StaticInfoPage title="Shipping Info">
    <h2>Delivery Times & Costs</h2>
    <p>We ship all over Vietnam using our trusted logistics partners. Standard delivery takes 2-4 business days depending on your location.</p>
    <ul>
      <li><strong>Standard Shipping:</strong> 30,000 VND (Free for orders over 500,000 VND)</li>
      <li><strong>Express Shipping:</strong> 50,000 VND (1-2 business days, available for select cities)</li>
    </ul>
    <h2>Order Tracking</h2>
    <p>Once your order has been dispatched, you will receive an email with a tracking number and a link to track your package.</p>
  </StaticInfoPage>
);

export const ReturnsPage = () => (
  <StaticInfoPage title="Returns & Exchanges">
    <h2>Return Policy</h2>
    <p>We want you to be completely satisfied with your purchase. If you are not happy, you can return items within 14 days of receipt for a refund or exchange.</p>
    <h3>Conditions</h3>
    <ul>
      <li>Items must be unworn, unwashed, and in original condition with tags attached.</li>
      <li>Sale items and accessories (socks, hats) are final sale and cannot be returned.</li>
    </ul>
    <h2>How to Return</h2>
    <p>Please contact our customer service team at contact@d4kstore.com with your order number to initiate a return. We will provide you with a return shipping label.</p>
  </StaticInfoPage>
);

export const FAQPage = () => (
  <StaticInfoPage title="FAQ">
    <h2>Frequently Asked Questions</h2>
    
    <h3>Do you ship internationally?</h3>
    <p>Currently, we only ship within Vietnam. We are working on expanding our delivery options in the future.</p>
    
    <h3>What payment methods do you accept?</h3>
    <p>We accept VNPay, major credit/debit cards (Visa, Mastercard), and Cash on Delivery (COD) for eligible locations.</p>
    
    <h3>How do I know my size?</h3>
    <p>All our products feature an oversized streetwear fit. Please refer to the size guide on each product page for detailed measurements.</p>
    
    <h3>Can I cancel or change my order?</h3>
    <p>Orders can be cancelled or modified within 1 hour of placement. Please contact our support team immediately if you need to make changes.</p>
  </StaticInfoPage>
);

export const TermsPage = () => (
  <StaticInfoPage title="Terms of Service">
    <h2>1. Introduction</h2>
    <p>Welcome to D4K Store. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.</p>
    
    <h2>2. Product Information</h2>
    <p>We make every effort to display the colors and images of our products as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</p>
    
    <h2>3. Pricing & Availability</h2>
    <p>Prices are subject to change without notice. We reserve the right to modify or discontinue any product without notice at any time.</p>
    
    <h2>4. Governing Law</h2>
    <p>These terms shall be governed by and construed in accordance with the laws of Vietnam.</p>
  </StaticInfoPage>
);

export const PrivacyPage = () => (
  <StaticInfoPage title="Privacy Policy">
    <h2>Information We Collect</h2>
    <p>When you visit our site, we automatically collect certain information about your device, including information about your web browser, IP address, and time zone. Additionally, when you make a purchase, we collect your name, billing address, shipping address, and payment information.</p>
    
    <h2>How We Use Your Information</h2>
    <p>We use the Order Information we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
    
    <h2>Data Security</h2>
    <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
  </StaticInfoPage>
);
