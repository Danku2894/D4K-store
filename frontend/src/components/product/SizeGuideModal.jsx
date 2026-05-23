import { useState, useMemo } from 'react';
import { FiX, FiInfo, FiUser } from 'react-icons/fi';

/**
 * SizeGuideModal Component
 * Hiển thị bảng Size và tính năng Fit Predictor
 */
const SizeGuideModal = ({ isOpen, onClose, sizeGuideJson }) => {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'predictor'
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitPreference, setFitPreference] = useState('regular');
  const [predictedSize, setPredictedSize] = useState(null);

  // Parse JSON data safely
  const sizeData = useMemo(() => {
    if (!sizeGuideJson) return null;
    try {
      return JSON.parse(sizeGuideJson);
    } catch (e) {
      console.error('Invalid size guide JSON', e);
      return null;
    }
  }, [sizeGuideJson]);

  if (!isOpen || !sizeData) return null;

  const { attributes, sizes } = sizeData;

  const handlePredict = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const h = parseInt(height);
    const w = parseInt(weight);

    let matchScore = 0;
    let bestIndex = 0;

    sizes.forEach((size, index) => {
      let score = 0;
      
      const [hMin, hMax] = size.height ? size.height.split('-').map(Number) : [0, 0];
      const [wMin, wMax] = size.weight ? size.weight.split('-').map(Number) : [0, 0];

      if (hMin && hMax && h >= hMin && h <= hMax) score += 1;
      if (wMin && wMax && w >= wMin && w <= wMax) score += 1.5;

      if (score > matchScore) {
        matchScore = score;
        bestIndex = index;
      }
    });

    if (matchScore === 0) {
      let minDiff = 999;
      sizes.forEach((size, index) => {
        const [wMin, wMax] = size.weight ? size.weight.split('-').map(Number) : [0, 0];
        const avgW = (wMin + wMax) / 2;
        const diff = Math.abs(w - avgW);
        if (diff < minDiff) {
          minDiff = diff;
          bestIndex = index;
        }
      });
    }

    // Apply Fit Preference Adjustment
    if (fitPreference === 'slim' && bestIndex > 0) {
      bestIndex -= 1;
    } else if (fitPreference === 'oversize' && bestIndex < sizes.length - 1) {
      bestIndex += 1;
    }

    setPredictedSize(sizes[bestIndex].name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light-50 w-full max-w-2xl border-4 border-dark-950 shadow-harsh relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-4 border-dark-950 flex justify-between items-center bg-light-100 shrink-0">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center space-x-2">
            <FiInfo />
            <span>SIZE GUIDE</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 border-2 border-transparent hover:border-dark-950 transition-all hover:bg-dark-950 hover:text-light-50"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-dark-950 shrink-0">
          <button
            className={`flex-1 py-4 font-black uppercase tracking-wider text-sm transition-colors
              ${activeTab === 'chart' ? 'bg-dark-950 text-light-50' : 'bg-light-50 text-dark-950 hover:bg-light-200'}`}
            onClick={() => setActiveTab('chart')}
          >
            SIZE CHART
          </button>
          <button
            className={`flex-1 py-4 font-black uppercase tracking-wider text-sm transition-colors border-l-4 border-dark-950
              ${activeTab === 'predictor' ? 'bg-street-red text-light-50' : 'bg-light-50 text-dark-950 hover:bg-light-200'}`}
            onClick={() => setActiveTab('predictor')}
          >
            FIT PREDICTOR
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'chart' && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-gray-600 font-bold uppercase tracking-wide text-sm text-center">
                Measurements are in centimeters (CM)
              </p>
              
              <div className="overflow-x-auto border-2 border-dark-950">
                <table className="w-full text-center">
                  <thead>
                    <tr className="bg-dark-950 text-light-50">
                      <th className="p-3 border-b-2 border-dark-950 font-black uppercase tracking-widest">SIZE</th>
                      {attributes?.map(attr => (
                        <th key={attr} className="p-3 border-b-2 border-dark-950 font-black uppercase tracking-widest">
                          {attr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-dark-950 bg-light-50">
                    {sizes?.map(size => (
                      <tr key={size.name} className="hover:bg-light-100 transition-colors">
                        <td className="p-3 font-black text-lg border-r-2 border-dark-950">{size.name}</td>
                        {attributes?.map(attr => (
                          <td key={attr} className="p-3 font-bold text-gray-700">
                            {size.measurements[attr] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-light-200 p-4 border-l-4 border-dark-950">
                <p className="text-sm font-bold text-gray-700">
                  <span className="text-street-red">NOTE:</span> Please allow 1-2cm difference due to manual measurement. Streetwear usually runs slightly oversized.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'predictor' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <FiUser size={48} className="mx-auto mb-4 text-dark-950" />
                <h3 className="text-xl font-black uppercase tracking-tight">FIND YOUR PERFECT FIT</h3>
                <p className="text-gray-600 font-bold uppercase tracking-wide text-sm mt-2">
                  Enter your measurements below and we'll recommend the best size for you.
                </p>
              </div>

              <form onSubmit={handlePredict} className="max-w-sm mx-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wider block">Height (CM)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-4 border-2 border-dark-950 font-bold text-lg focus:outline-none focus:border-street-red bg-light-50 transition-colors"
                    placeholder="E.G. 175"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wider block">Weight (KG)</label>
                  <input
                    type="number"
                    required
                    min="30"
                    max="200"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-4 border-2 border-dark-950 font-bold text-lg focus:outline-none focus:border-street-red bg-light-50 transition-colors"
                    placeholder="E.G. 65"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-wider block">Fit Preference</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFitPreference('slim')}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                        fitPreference === 'slim' ? 'bg-dark-950 border-dark-950 text-light-50' : 'border-dark-950 text-dark-950 hover:bg-light-200'
                      }`}
                    >
                      SLIM FIT
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitPreference('regular')}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                        fitPreference === 'regular' ? 'bg-dark-950 border-dark-950 text-light-50' : 'border-dark-950 text-dark-950 hover:bg-light-200'
                      }`}
                    >
                      REGULAR
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitPreference('oversize')}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                        fitPreference === 'oversize' ? 'bg-dark-950 border-dark-950 text-light-50' : 'border-dark-950 text-dark-950 hover:bg-light-200'
                      }`}
                    >
                      OVERSIZE
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-dark-950 text-light-50 font-black uppercase tracking-widest border-2 border-dark-950 hover:bg-street-red hover:border-street-red transition-all transform hover:-translate-y-1"
                >
                  CALCULATE SIZE
                </button>
              </form>

              {predictedSize && (
                <div className="mt-8 p-6 border-4 border-street-red bg-red-50 text-center animate-scaleIn">
                  <p className="text-sm font-bold uppercase tracking-widest text-street-red mb-2">
                    WE RECOMMEND
                  </p>
                  <div className="text-5xl font-display font-black text-dark-950 mb-2 glitch-street">
                    SIZE {predictedSize}
                  </div>
                  <p className="text-gray-700 font-bold text-sm">
                    This size is optimized based on your height, weight, and fit preference.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
