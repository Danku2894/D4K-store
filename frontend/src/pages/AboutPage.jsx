import { Link } from 'react-router-dom';
import { FiArrowRight, FiTarget, FiBox, FiUsers } from 'react-icons/fi';
import aboutImage from '@assets/images/dccf730e0555604dd558bbb431f241ba.jpg';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Hero Section */}
      <div className="bg-dark-950 text-light-50 py-20 px-4">
        <div className="container-street text-center">
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-6 glitch-street text-light-50">
            WE ARE D4K
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-wide text-gray-400 max-w-3xl mx-auto">
            Redefining Streetwear for the New Generation
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-street py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight">
              THE MISSION
            </h2>
            <div className="h-2 w-20 bg-street-red"></div>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              D4K Store wasn't born in a boardroom. It started in the streets. 
              We believe that fashion is more than just fabric—it's a statement, 
              an identity, and a rebellion.
            </p>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Our goal is simple: bring high-quality, cutting-edge streetwear 
              to those who aren't afraid to stand out. We merge contemporary 
              aesthetics with raw urban vibes to create pieces that speak louder than words.
            </p>
          </div>
          <div className="border-4 border-dark-950 p-4 bg-light-50 relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
             <img 
               src={aboutImage}
               alt="Streetwear Culture" 
               className="w-full h-96 object-cover object-top border-2 border-dark-950 grayscale hover:grayscale-0 transition-all duration-500"
             />
             <div className="absolute -bottom-6 -right-6 bg-dark-950 text-light-50 px-6 py-2 font-black uppercase text-xl">
               Since 2024
             </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-light-100 py-20 border-y-4 border-dark-950">
        <div className="container-street">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="p-8 border-2 border-dark-950 bg-light-50 hover:-translate-y-2 transition-transform duration-300">
              <FiTarget className="text-5xl text-street-red mb-6" />
              <h3 className="text-2xl font-black uppercase mb-4">Authenticity</h3>
              <p className="text-gray-600 font-medium">
                We stay true to the roots of street culture. No fakes, no compromises. 
                Just pure, unadulterated style.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 border-2 border-dark-950 bg-light-50 hover:-translate-y-2 transition-transform duration-300">
              <FiBox className="text-5xl text-street-neon mb-6" />
              <h3 className="text-2xl font-black uppercase mb-4">Quality</h3>
              <p className="text-gray-600 font-medium">
                Every stitch counts. We select the finest materials to ensure 
                our gear survives the hustle of everyday life.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 border-2 border-dark-950 bg-light-50 hover:-translate-y-2 transition-transform duration-300">
              <FiUsers className="text-5xl text-dark-950 mb-6" />
              <h3 className="text-2xl font-black uppercase mb-4">Community</h3>
              <p className="text-gray-600 font-medium">
                We are more than a brand; we are a movement. Join thousands of 
                like-minded individuals who dress to express.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-street py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-black uppercase mb-8">
          READY TO UPGRADE YOUR STYLE?
        </h2>
        <Link 
          to="/products"
          className="inline-flex items-center space-x-3 bg-dark-950 text-light-50 px-10 py-5 
                   font-black uppercase tracking-wider text-xl hover:bg-street-red transition-colors"
        >
          <span>SHOP LATEST DROP</span>
          <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
