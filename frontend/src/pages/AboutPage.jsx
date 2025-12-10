import { Link } from 'react-router-dom';
import whyChooseUsImage from '@assets/images/fda553a2e84a3680bdd9063f3d73e3a4.jpg';
import { FiArrowRight, FiTarget, FiBox, FiUsers, FiStar, FiGlobe, FiRefreshCcw } from 'react-icons/fi';
import logoAbout from '@assets/images/logo_about.png';
import aboutImage from '@assets/images/dccf730e0555604dd558bbb431f241ba.jpg';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-light-50">
      {/* Hero Section */}
      <div className="bg-dark-950 text-light-50 py-20 px-4">
        <div className="container-street text-center">
          <div className="mb-6 flex justify-center">
            <img 
              src={logoAbout} 
              alt="WE ARE D4K" 
              className="h-32 md:h-48 object-contain" 
            />
          </div>
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

      {/* Core Values Section */}
      <div className="bg-light-100 py-24 border-y-4 border-dark-950">
        <div className="container-street">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight mb-4">Core Values</h2>
            <div className="h-1 w-24 bg-street-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="group relative bg-light-50 border-2 border-dark-950 p-6 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] transition-all duration-200">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-7xl font-black text-dark-950 leading-none">01</span>
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-dark-950 text-light-50 flex items-center justify-center mb-4 group-hover:bg-street-red transition-colors duration-300">
                  <FiTarget className="text-2xl" />
                </div>
                
                <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Authenticity</h3>
                <p className="text-sm text-gray-600 font-bold leading-relaxed group-hover:text-dark-950 transition-colors">
                  We stay true to the roots of street culture. No fakes, no compromises. 
                  Just pure, unadulterated style.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="group relative bg-light-50 border-2 border-dark-950 p-6 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] transition-all duration-200">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-7xl font-black text-dark-950 leading-none">02</span>
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-dark-950 text-light-50 flex items-center justify-center mb-4 group-hover:bg-street-red transition-colors duration-300">
                   <FiBox className="text-2xl" />
                </div>
                
                <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Quality</h3>
                <p className="text-sm text-gray-600 font-bold leading-relaxed group-hover:text-dark-950 transition-colors">
                  Every stitch counts. We select the finest materials to ensure 
                  our gear survives the hustle of everyday life.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="group relative bg-light-50 border-2 border-dark-950 p-6 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] transition-all duration-200">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="text-7xl font-black text-dark-950 leading-none">03</span>
              </div>
              
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-dark-950 text-light-50 flex items-center justify-center mb-4 group-hover:bg-street-red transition-colors duration-300">
                  <FiUsers className="text-2xl" />
                </div>
                
                <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Community</h3>
                <p className="text-sm text-gray-600 font-bold leading-relaxed group-hover:text-dark-950 transition-colors">
                  We are more than a brand; we are a movement. Join thousands of 
                  like-minded individuals who dress to express.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container-street py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Single Framed Image */}
          <div className="border-4 border-dark-950 p-4 bg-light-50 relative transform -rotate-2 hover:rotate-0 transition-transform duration-300">
             <img 
               src={whyChooseUsImage}
               alt="Why Choose Us" 
               className="w-full h-[500px] object-cover object-center border-2 border-dark-950 grayscale hover:grayscale-0 transition-all duration-500"
             />
             <div className="absolute -bottom-5 -left-5 bg-dark-950 text-light-50 px-6 py-2 font-black uppercase text-xl">
               Since 2024
             </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight">
              WHY CHOOSE US?
            </h2>
            <div className="h-2 w-20 bg-street-red"></div>
            
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              We define ourselves by what we refuse to compromise on. Our exclusive drops are limited editions designed for those who lead the trends, ensuring you always stand out from the crowd.
            </p>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Sustainability isn't just a buzzword for us; it's a commitment. From ethically sourced materials to 100% recyclable packaging, we ensure our impact on the planet is as positive as our impact on your style.
            </p>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              We stand behind every piece we create with a no-questions-asked guarantee. If you don't love it, we'll make it right. That's the D4K promise.
            </p>
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
