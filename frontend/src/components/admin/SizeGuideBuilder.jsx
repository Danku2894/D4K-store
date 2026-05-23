import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';

/**
 * SizeGuideBuilder Component
 * Visual builder for Size Guide JSON
 */
const SizeGuideBuilder = ({ value, onChange }) => {
  const [data, setData] = useState({
    type: 'top',
    attributes: ['Length', 'Width'],
    sizes: []
  });
  const [error, setError] = useState(null);

  // Parse initial value
  useEffect(() => {
    if (!value) {
      setData({ type: 'top', attributes: ['Length', 'Width'], sizes: [] });
      return;
    }
    
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        setData({
          type: parsed.type || 'top',
          attributes: parsed.attributes || ['Length', 'Width'],
          sizes: parsed.sizes || []
        });
        setError(null);
      }
    } catch (e) {
      setError('Current data is not valid JSON. Using default builder state.');
      // Keep current data or reset, but we don't want to wipe user's invalid input immediately
    }
  }, [value]);

  // Trigger onChange when data changes
  const updateData = (newData) => {
    setData(newData);
    // Only update parent if we have valid sizes
    onChange(JSON.stringify(newData));
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let newAttrs = [...data.attributes];
    
    // Auto-suggest attributes based on type
    if (newType === 'top' && data.type !== 'top') {
      newAttrs = ['Length', 'Width', 'Shoulder', 'Sleeve'];
    } else if (newType === 'bottom' && data.type !== 'bottom') {
      newAttrs = ['Length', 'Waist', 'Hip', 'Thigh'];
    }
    
    updateData({ ...data, type: newType, attributes: newAttrs });
  };

  const handleAddAttribute = () => {
    const attrName = prompt("Enter new attribute name (e.g. Inseam, Chest):");
    if (attrName && !data.attributes.includes(attrName)) {
      updateData({ ...data, attributes: [...data.attributes, attrName] });
    }
  };

  const handleRemoveAttribute = (attrToRemove) => {
    const newAttrs = data.attributes.filter(a => a !== attrToRemove);
    updateData({ ...data, attributes: newAttrs });
  };

  const handleAddSize = () => {
    updateData({
      ...data,
      sizes: [
        ...data.sizes,
        {
          name: '',
          height: '',
          weight: '',
          measurements: {}
        }
      ]
    });
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...data.sizes];
    newSizes.splice(index, 1);
    updateData({ ...data, sizes: newSizes });
  };

  const handleSizeChange = (index, field, val) => {
    const newSizes = [...data.sizes];
    newSizes[index][field] = val;
    updateData({ ...data, sizes: newSizes });
  };

  const handleMeasurementChange = (index, attr, val) => {
    const newSizes = [...data.sizes];
    if (!newSizes[index].measurements) newSizes[index].measurements = {};
    newSizes[index].measurements[attr] = val;
    updateData({ ...data, sizes: newSizes });
  };

  return (
    <div className="border-2 border-dark-950 p-4 space-y-4 bg-light-100">
      {error && (
        <div className="p-2 bg-street-red text-light-50 text-xs font-bold flex items-center space-x-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Settings */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-black uppercase">Category Type</label>
          <select 
            value={data.type}
            onChange={handleTypeChange}
            className="w-full p-2 border-2 border-dark-950 text-sm font-bold focus:outline-none"
          >
            <option value="top">Top (Shirts, Jackets...)</option>
            <option value="bottom">Bottom (Pants, Shorts...)</option>
            <option value="accessory">Accessory (Hats, Rings...)</option>
          </select>
        </div>

        <div className="flex-[2] space-y-1">
          <label className="text-xs font-black uppercase">Measurement Attributes</label>
          <div className="flex flex-wrap gap-2 items-center min-h-[40px] p-2 border-2 border-dark-950 bg-light-50">
            {data.attributes.map(attr => (
              <span key={attr} className="bg-dark-950 text-light-50 px-2 py-1 text-xs font-bold flex items-center space-x-1">
                <span>{attr}</span>
                <button type="button" onClick={() => handleRemoveAttribute(attr)} className="text-street-red hover:text-light-50 ml-1">
                  <FiX size={12} />
                </button>
              </span>
            ))}
            <button 
              type="button" 
              onClick={handleAddAttribute}
              className="text-xs font-bold px-2 py-1 border-2 border-dashed border-dark-950 hover:bg-dark-950 hover:text-light-50 transition-colors"
            >
              + ADD
            </button>
          </div>
        </div>
      </div>

      {/* Sizes Table */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black uppercase">Sizes Configuration</label>
          <button 
            type="button" 
            onClick={handleAddSize}
            className="text-xs font-bold bg-dark-950 text-light-50 px-3 py-1 flex items-center space-x-1 hover:bg-street-red transition-colors"
          >
            <FiPlus />
            <span>ADD ROW</span>
          </button>
        </div>

        <div className="overflow-x-auto border-2 border-dark-950">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-dark-950 text-light-50">
              <tr>
                <th className="p-2 font-bold w-16">SIZE</th>
                <th className="p-2 font-bold w-24">HEIGHT (155-165)</th>
                <th className="p-2 font-bold w-24 border-r border-gray-600">WEIGHT (45-55)</th>
                {data.attributes.map(attr => (
                  <th key={attr} className="p-2 font-bold">{attr}</th>
                ))}
                <th className="p-2 font-bold text-center w-10">#</th>
              </tr>
            </thead>
            <tbody className="bg-light-50 divide-y divide-gray-200">
              {data.sizes.length === 0 ? (
                <tr>
                  <td colSpan={data.attributes.length + 4} className="p-4 text-center text-gray-500 font-bold">
                    No sizes added yet. Click "ADD ROW" to begin.
                  </td>
                </tr>
              ) : (
                data.sizes.map((size, index) => (
                  <tr key={index}>
                    <td className="p-1">
                      <input 
                        type="text" 
                        value={size.name} 
                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                        placeholder="M"
                        className="w-full p-1 border border-gray-300 focus:border-dark-950 outline-none text-center font-bold"
                      />
                    </td>
                    <td className="p-1">
                      <input 
                        type="text" 
                        value={size.height || ''} 
                        onChange={(e) => handleSizeChange(index, 'height', e.target.value)}
                        placeholder="165-175"
                        className="w-full p-1 border border-gray-300 focus:border-dark-950 outline-none text-center"
                      />
                    </td>
                    <td className="p-1 border-r border-gray-200">
                      <input 
                        type="text" 
                        value={size.weight || ''} 
                        onChange={(e) => handleSizeChange(index, 'weight', e.target.value)}
                        placeholder="55-65"
                        className="w-full p-1 border border-gray-300 focus:border-dark-950 outline-none text-center"
                      />
                    </td>
                    {data.attributes.map(attr => (
                      <td key={attr} className="p-1">
                        <input 
                          type="text" 
                          value={size.measurements?.[attr] || ''} 
                          onChange={(e) => handleMeasurementChange(index, attr, e.target.value)}
                          placeholder="0"
                          className="w-full p-1 border border-gray-300 focus:border-dark-950 outline-none text-center"
                        />
                      </td>
                    ))}
                    <td className="p-1 text-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(index)}
                        className="text-street-red p-1 hover:bg-red-100 rounded"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Re-export icon internally just for this component file to be self-contained for the missing FiX
const FiX = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default SizeGuideBuilder;
