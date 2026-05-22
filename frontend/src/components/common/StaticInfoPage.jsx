import SEOHelmet from '@components/common/SEOHelmet';

const StaticInfoPage = ({ title, children, description }) => {
  return (
    <>
      <SEOHelmet 
        title={`${title} | D4K Store`}
        description={description || `Information about ${title} at D4K Store`}
      />
      <div className="container-street py-12 md:py-20 min-h-screen">
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-12 glitch-street">
          {title}
        </h1>
        
        <div className="p-8 md:p-12 border-4 border-dark-950 bg-light-50">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:font-medium prose-a:text-street-red prose-a:font-bold">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticInfoPage;
