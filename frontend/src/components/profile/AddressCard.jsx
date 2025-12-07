import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`border-4 p-6 relative transition-all duration-300 ${
      address.isDefault 
        ? 'border-street-blue bg-light-50' 
        : 'border-dark-950 bg-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
    }`}>
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute -top-4 -right-4 bg-street-blue text-dark-950 px-4 py-1 font-black uppercase text-sm border-2 border-dark-950 transform rotate-2">
          Default
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-black text-xl uppercase text-dark-950 mb-1">
            {address.receiverName}
          </h3>
          <p className="text-gray-600 font-bold font-mono text-sm">
            {address.phone}
          </p>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <p className="text-gray-800 font-medium">{address.address}</p>
        <p className="text-gray-600 text-sm">
          {address.ward}, {address.district}
        </p>
        <p className="text-gray-800 font-bold uppercase">{address.city}</p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-2 px-4 py-2 bg-light-200 hover:bg-street-yellow border-2 border-dark-950 font-bold text-xs uppercase transition-colors"
        >
          <FiEdit2 /> Edit
        </button>
        
        <button
          onClick={() => onDelete(address.id)}
          className="flex items-center gap-2 px-4 py-2 bg-light-200 hover:bg-street-red hover:text-white border-2 border-dark-950 font-bold text-xs uppercase transition-colors"
        >
          <FiTrash2 /> Delete
        </button>

        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="ml-auto text-gray-500 hover:text-street-blue font-bold text-xs uppercase flex items-center gap-1"
          >
            <FiCheck /> Set Default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
