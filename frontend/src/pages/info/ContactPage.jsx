import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import SEOHelmet from '@components/common/SEOHelmet';

const ContactPage = () => {
  return (
    <>
      <SEOHelmet 
        title="Contact Us | D4K Store"
        description="Get in touch with D4K Store. We're here to help with any questions about our streetwear collection."
      />
      <div className="container-street py-12 md:py-20 min-h-screen">
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-12 glitch-street">
          CONTACT US
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-8 border-4 border-dark-950 bg-light-50 hover:shadow-street transition-all">
              <h2 className="text-2xl font-black uppercase mb-6">Get In Touch</h2>
              <div className="space-y-6 text-gray-700 font-medium">
                <div className="flex items-start space-x-4">
                  <FiMapPin className="text-street-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-dark-950 uppercase">Address</h3>
                    <p>123 Fashion Street, District 1</p>
                    <p>Ho Chi Minh City, Vietnam</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FiPhone className="text-street-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-dark-950 uppercase">Phone</h3>
                    <p>+84 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FiMail className="text-street-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-dark-950 uppercase">Email</h3>
                    <p>contact@d4kstore.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 border-4 border-dark-950 bg-light-50">
            <h2 className="text-2xl font-black uppercase mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Name</label>
                <input type="text" className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:border-street-red" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Email</label>
                <input type="email" className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:border-street-red" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Message</label>
                <textarea rows="5" className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:border-street-red"></textarea>
              </div>
              <button type="submit" className="btn-street w-full text-center">
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
