import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Breadcrumb Component - Street Style
 * Navigation breadcrumb với bold typography
 * 
 * @param {Array} items - Breadcrumb items [{ label, path }]
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 flex-wrap">
        {/* Home */}
        <li>
          <Link 
            to="/" 
            className="text-gray-600 hover:text-dark-950 font-bold uppercase text-sm tracking-wide transition-colors"
          >
            HOME
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {/* Separator */}
            <FiChevronRight className="text-gray-400" size={16} />
            
            {/* Link or Current */}
            {item.path ? (
              <Link 
                to={item.path}
                className="text-gray-600 hover:text-dark-950 font-bold uppercase text-sm tracking-wide transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-dark-950 font-black uppercase text-sm tracking-wide">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

