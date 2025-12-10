import { FiCreditCard, FiDollarSign, FiSmartphone, FiCheck } from 'react-icons/fi';

/**
 * PaymentMethodSelector Component - Street Style
 * Chọn phương thức thanh toán
 * 
 * @param {String} selectedMethod - Payment method được chọn
 * @param {Function} onSelectMethod - Callback khi chọn method
 */
const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const paymentMethods = [
    {
      id: 'COD',
      name: 'CASH ON DELIVERY',
      description: 'Pay when you receive',
      icon: FiDollarSign,
      available: true,
    },
    {
      id: 'VNPAY',
      name: 'VNPAY',
      description: 'Pay with VNPay',
      icon: FiSmartphone,
      available: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-black uppercase tracking-tight">
        PAYMENT METHOD
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          
          return (
            <button
              key={method.id}
              onClick={() => method.available && onSelectMethod(method.id)}
              disabled={!method.available}
              className={`
                p-6 border-2 text-left transition-all relative
                ${!method.available
                  ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
                  : selectedMethod === method.id
                  ? 'border-street-red bg-street-red/10'
                  : 'border-dark-950 bg-light-50 hover:border-street-red hover:scale-[1.02]'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-3 border-2 transition-all
                    ${!method.available
                      ? 'border-gray-300 text-gray-400'
                      : selectedMethod === method.id
                      ? 'border-street-red bg-street-red text-light-50'
                      : 'border-dark-950 text-dark-950'
                    }
                  `}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-black uppercase tracking-wide">
                        {method.name}
                      </h4>
                      {!method.available && (
                        <span className="px-2 py-0.5 bg-gray-400 text-white text-xs font-bold uppercase">
                          SOON
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {method.description}
                    </p>
                  </div>
                </div>

                {selectedMethod === method.id && method.available && (
                  <div className="ml-2">
                    <FiCheck size={24} className="text-street-red" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Payment Info */}
      {selectedMethod && (
        <div className="p-4 border-2 border-dark-950 bg-light-100">
          {selectedMethod === 'COD' && (
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-gray-600">
                PAYMENT INFORMATION
              </p>
              <p className="text-sm text-gray-700 font-medium">
                Pay in cash when you receive your order. Please prepare the exact amount.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;

