import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import apiClient from '@services/api-client';
import useCartStore from '@store/use-cart-store';

const PaymentCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Verifying payment...');
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get all params from URL
                const params = Object.fromEntries(searchParams.entries());
                
                // Call backend to verify (using the existing endpoint or new one)
                // We reuse the existing endpoint: /payment/vn-pay-return
                // Note: apiClient returns response directly as per my previous fix
                const response = await apiClient.get('/payment/vn-pay-return', { params });
                
                if (response.success) {
                    setStatus('success');
                    setMessage('Payment Successful!');
                    clearCart();
                    
                    // Extract Order ID if possible (from vnp_TxnRef or OrderInfo)
                    // vnp_TxnRef in our code is orderId
                    const orderId = searchParams.get('vnp_TxnRef');
                    
                    setTimeout(() => {
                        navigate('/order-success/' + orderId);
                    }, 2000);
                } else {
                    setStatus('failed');
                    setMessage(response.message || 'Payment Failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                
                // Check specific VNPAY response code if available locally
                const vnpResponseCode = searchParams.get('vnp_ResponseCode');
                if (vnpResponseCode !== '00') {
                    setStatus('failed');
                    setMessage(`Payment Failed (Code: ${vnpResponseCode})`);
                } else {
                    setStatus('failed');
                    setMessage(error.message || 'Verification Error');
                }
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            {status === 'processing' && (
                <div className="text-center">
                    <FiLoader className="text-6xl text-street-neon animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase">Processing Payment...</h2>
                    <p className="text-gray-600">Please do not close this window.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center">
                    <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase text-green-600">Payment Successful!</h2>
                    <p className="text-gray-600">Redirecting to order details...</p>
                </div>
            )}

            {status === 'failed' && (
                <div className="text-center">
                    <FiXCircle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase text-red-600">Payment Failed</h2>
                    <p className="text-gray-600 font-bold mb-6">{message}</p>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="btn-street"
                    >
                        Try Again
                    </button>
                    <div className="mt-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-dark-950 underline"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentCallbackPage;
