import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaLock, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckoutStepper from './CheckoutStepper';
import OrderSummaryCheckout from './OrderSummaryCheckout';
import Khqr from './Khqr';
import { apiService } from '../../service/api';

const InputField = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
  </div>
);

const CollapsibleSection = ({ title, icon, children, isOpen, onToggle, isCompleted, disabled }) => (
  <div className={`border rounded-lg mb-4 ${isCompleted && !isOpen ? 'border-green-300 bg-green-50' : 'bg-white'} ${disabled ? 'opacity-60' : ''}`}>
    <button onClick={disabled ? null : onToggle} className={`w-full flex justify-between items-center p-4 text-left font-semibold ${isOpen ? 'rounded-t-lg bg-gray-50' : 'rounded-lg hover:bg-gray-50'}`} disabled={disabled}>
      <div className="flex items-center">
        {React.cloneElement(icon, { className: `mr-3 ${isCompleted && !isOpen ? 'text-green-600' : 'text-orange-500'}` })}
        {title}
        {isCompleted && !isOpen && <span className="ml-2 text-xs font-normal text-green-700">(Completed)</span>}
      </div>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    {isOpen && <div className="p-5 border-t">{children}</div>}
  </div>
);

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({ street_line: '', district: '', province: '', phone: user?.phone_number || '' });
  const [useNewAddress, setUseNewAddress] = useState(false);
  
  const [orderData, setOrderData] = useState(null);
  const [qrCodeString, setQrCodeString] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const pollingIntervalId = React.useRef(null);

  const shippingMethods = [
    { id: 'vet', name: 'VET Express', price: 0, estimatedDelivery: '1-2 days', logo: 'https://placehold.co/100x40/009688/FFFFFF?text=VET' },
    { id: 'j&t', name: 'J&T Express', price: 0, estimatedDelivery: '2-3 days', logo: 'https://placehold.co/100x40/FF0000/FFFFFF?text=J%26T' },
    { id: 'capitol', name: 'Capitol Delivery', price: 0, estimatedDelivery: 'Same day', logo: 'https://placehold.co/100x40/003366/FFFFFF?text=Capitol' },
  ];
  
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);

  const fetchUserAddresses = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const addresses = await apiService.getAddressCustomer(user.id);
      setUserAddresses(addresses);
      if (addresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(addresses[0].address_id);
      } else if (addresses.length === 0) {
        setUseNewAddress(true);
      }
    } catch (err) {
      setApiError('Failed to load addresses.');
    }
  }, [isAuthenticated, user?.id, selectedAddressId]);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  const startPollingPayment = useCallback((md5, orderId) => {
    if (pollingIntervalId.current) clearInterval(pollingIntervalId.current);
    let attempts = 0;
    pollingIntervalId.current = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        setPaymentStatus('failed');
        clearInterval(pollingIntervalId.current);
        return;
      }
      try {
        const response = await apiService.checkPaymentStatus(md5, orderId);
        if (response?.payment_status === 'Completed') {
          setPaymentStatus('completed');
          clearInterval(pollingIntervalId.current);
          
 
          setTimeout(() => {
            navigate('/checkout/success');
            clearCart();
          }, 1500); 
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);
  }, [navigate, clearCart]);

  const initiatePaymentFlow = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      let currentOrder = orderData;
      
      if (!currentOrder) {
        const orderResponse = await apiService.placeOrder(user.id, selectedAddressId, selectedShippingMethod.name);
        setOrderData(orderResponse);
        currentOrder = orderResponse;
      }
      
      const qrResponse = await apiService.getKhqr(currentOrder.amount_pay, currentOrder.order_id, 'KHR');
      setQrCodeString(qrResponse.khqr_string);
      setPaymentStatus('pending_payment');
      startPollingPayment(qrResponse.unique_md5, currentOrder.order_id);
      
    } catch (error) {
      setApiError(error.message || 'Failed to initiate payment.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedAddressId, selectedShippingMethod, startPollingPayment, orderData]);

  useEffect(() => {
    if (currentStep === 3) {
        initiatePaymentFlow();
    }
    return () => {
      if (pollingIntervalId.current) clearInterval(pollingIntervalId.current);
    };
  }, [currentStep, initiatePaymentFlow]);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (useNewAddress) {
        try {
          await apiService.addAddressCustomer(user.id, newAddressForm);
          await fetchUserAddresses();
          setUseNewAddress(false);
        } catch (err) {
          setApiError('Failed to save new address.');
          return;
        }
      }
      setCurrentStep(2);
    }
    if (currentStep === 2) {
        setCurrentStep(3);
    }
  };

  if (!isAuthenticated) return <div className="p-8 text-center">Please log in to proceed.</div>;
  if (cartItems.length === 0 && currentStep < 3) return <div className="p-8 text-center">Your cart is empty.</div>;

  return (
    <div className="bg-gray-100 p-4 sm:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/cart')} className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500 mb-6 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <CheckoutStepper currentStep={currentStep} steps={[{ id: 1, name: 'Address' }, { id: 2, name: 'Shipping' }, { id: 3, name: 'Payment' }]} />
        {apiError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{apiError}</div>}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            <CollapsibleSection title="1. Shipping Address" icon={<FaMapMarkerAlt />} isOpen={currentStep === 1} onToggle={() => setCurrentStep(1)} isCompleted={currentStep > 1} disabled={currentStep !== 1}>
              <div className="space-y-3">
                {userAddresses.map(addr => (
                  <label key={addr.address_id} className={`flex items-center p-3 border rounded-md cursor-pointer ${selectedAddressId === addr.address_id && !useNewAddress ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}`}>
                    <input type="radio" name="address" value={addr.address_id} checked={selectedAddressId === addr.address_id && !useNewAddress} onChange={() => { setSelectedAddressId(addr.address_id); setUseNewAddress(false); }} className="form-radio text-orange-600"/>
                    <span className="ml-3 text-sm">{`${addr.street_line}, ${addr.district}, ${addr.province}`}</span>
                  </label>
                ))}
                <label className={`flex items-center p-3 border rounded-md cursor-pointer ${useNewAddress ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}`}>
                  <input type="radio" name="address" checked={useNewAddress} onChange={() => { setUseNewAddress(true); setSelectedAddressId(null); }} className="form-radio text-orange-600"/>
                  <span className="ml-3 text-sm">Add a new address</span>
                </label>
              </div>
              {useNewAddress && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <InputField label="Street Line" id="street_line" value={newAddressForm.street_line} onChange={(e) => setNewAddressForm(p => ({...p, street_line: e.target.value}))}/>
                  <InputField label="District" id="district" value={newAddressForm.district} onChange={(e) => setNewAddressForm(p => ({...p, district: e.target.value}))}/>
                  <InputField label="Province" id="province" value={newAddressForm.province} onChange={(e) => setNewAddressForm(p => ({...p, province: e.target.value}))}/>
                  <InputField label="Phone" id="phone" type="tel" value={newAddressForm.phone} onChange={(e) => setNewAddressForm(p => ({...p, phone: e.target.value}))}/>
                </div>
              )}
              <button onClick={handleNextStep} className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600">Continue</button>
            </CollapsibleSection>

            <CollapsibleSection title="2. Shipping Method" icon={<FaShippingFast />} isOpen={currentStep === 2} onToggle={() => setCurrentStep(2)} isCompleted={currentStep > 2} disabled={currentStep < 2}>
               <div className="space-y-3">
                {shippingMethods.map(method => (
                  <label key={method.id} className={`flex items-center p-3 border rounded-md cursor-pointer ${selectedShippingMethod?.id === method.id ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}`}>
                    <input type="radio" name="shipping" checked={selectedShippingMethod?.id === method.id} onChange={() => setSelectedShippingMethod(method)} className="form-radio text-orange-600"/>
                    <img src={method.logo} alt={`${method.name} logo`} className="ml-4 h-6 object-contain" />
                    <div className="ml-4 flex-grow">
                        <span className="block text-sm font-medium">{method.name}</span>
                        <span className="block text-xs text-gray-500">{method.estimatedDelivery}</span>
                    </div>
                    <span className="text-sm font-medium">${method.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleNextStep} className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600">Continue</button>
            </CollapsibleSection>

            <CollapsibleSection title="3. Payment" icon={<FaCreditCard />} isOpen={currentStep === 3} onToggle={() => {}} isCompleted={paymentStatus === 'completed'} disabled={currentStep < 3}>
              {loading && <div className="text-center p-4">Loading Payment Details...</div>}
              {paymentStatus === 'pending_payment' && <Khqr name={user?.name} amount={totalPrice} qrValue={qrCodeString} />}
              {paymentStatus === 'failed' && (
                  <div className="text-center p-4">
                      <p className="text-red-600 font-semibold mb-4">Payment failed or timed out.</p>
                      <button onClick={initiatePaymentFlow} className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600">
                          Retry Payment
                      </button>
                  </div>
              )}
              {paymentStatus === 'completed' && (
                <div className="text-center p-4">
                  <p className="text-green-600 font-semibold">Payment successful! Redirecting...</p>
                </div>
              )}
            </CollapsibleSection>
          </div>
          
          <div className="lg:w-2/5">
            <OrderSummaryCheckout currency="USD" />
            <div className="mt-6 p-3 bg-green-50 text-green-700 text-xs flex items-center rounded-md border border-green-200">
              <FaLock className="mr-2 shrink-0"/> Secure SSL encrypted checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
