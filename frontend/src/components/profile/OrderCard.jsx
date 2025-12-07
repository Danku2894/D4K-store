import { Link } from 'react-router-dom';
import { FiArrowRight, FiPackage } from 'react-icons/fi';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-street-yellow text-dark-950';
      case 'PAID': return 'bg-street-blue text-white';
      case 'SHIPPING': return 'bg-purple-500 text-white';
      case 'DELIVERED': return 'bg-green-500 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="border-2 border-dark-950 bg-white p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono font-bold text-gray-500">#{order.id}</span>
            <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-dark-950 ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-600 uppercase">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-gray-500 mb-1">Total Amount</p>
          <p className="font-display font-black text-2xl text-dark-950">
            {order.totalAmount?.toLocaleString('vi-VN')}đ
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {order.orderItems?.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-light-50 border-2 border-gray-100">
            <div className="w-12 h-12 bg-gray-200 border-2 border-dark-950 flex items-center justify-center">
              <FiPackage />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm line-clamp-1">{item.productName}</p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} × {item.price?.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        ))}
        {order.orderItems?.length > 2 && (
          <p className="text-xs font-bold text-gray-500 uppercase text-center">
            + {order.orderItems.length - 2} more items
          </p>
        )}
      </div>

      <Link 
        to={`/profile/orders/${order.id}`}
        className="block w-full py-3 bg-dark-950 text-white text-center font-black uppercase hover:bg-street-blue transition-colors flex items-center justify-center gap-2"
      >
        View Details <FiArrowRight />
      </Link>
    </div>
  );
};

export default OrderCard;
