import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin 
} from 'react-icons/fi';

/**
 * Footer Component - Y2K Style
 * Footer với links, social media, newsletter
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    toast.success('Subscribed to newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-dark-950 border-t-4 border-dark-950 mt-20">
      <div className="container-street py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-black uppercase text-light-50">
              D4K
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Your ultimate destination for streetwear fashion. 
              Bold styles for the new generation.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-light-50 text-light-50 
                         hover:bg-light-50 hover:text-dark-950 transition-all
                         flex items-center justify-center"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-light-50 text-light-50 
                         hover:bg-light-50 hover:text-dark-950 transition-all
                         flex items-center justify-center"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-light-50 text-light-50 
                         hover:bg-light-50 hover:text-dark-950 transition-all
                         flex items-center justify-center"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-light-50 text-light-50 
                         hover:bg-light-50 hover:text-dark-950 transition-all
                         flex items-center justify-center"
                aria-label="YouTube"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-light-50 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-street-red transition-colors text-sm font-bold uppercase tracking-wide"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-arrivals" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  to="/sale" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 glow-purple">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 glow-blue">
              Get in Touch
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-gray-400 text-sm">
                <FiMapPin className="flex-shrink-0 mt-1 text-y2k-pink" size={16} />
                <span>123 Fashion Street, District 1, Ho Chi Minh City</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiPhone className="flex-shrink-0 text-y2k-purple" size={16} />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiMail className="flex-shrink-0 text-y2k-blue" size={16} />
                <span>contact@d4kstore.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <label className="text-sm text-gray-400">
                Subscribe to our newsletter
              </label>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-lg bg-dark-800 border-2 border-y2k-purple/30 
                           text-white placeholder-gray-500 text-sm focus:outline-none focus:border-y2k-pink 
                           transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-y2k text-white font-semibold rounded-r-lg 
                           hover:shadow-neon transition-all text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-y2k-pink/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} D4K Store. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-y2k-pink transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Y2K Decorative Element */}
      <div className="h-1 bg-gradient-y2k"></div>
    </footer>
  );
};

export default Footer;

