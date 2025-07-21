import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaLock, FaChevronDown, FaChevronUp, FaCreditCard, FaShippingFast, FaMapMarkerAlt, FaMobileAlt, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckoutStepper from './CheckoutStepper';
import OrderSummaryCheckout from './OrderSummaryCheckout';
import Khqr from './Khqr';
import { apiService } from '../../service/api';

const InputField = ({ label, id, type = "text", placeholder, value, onChange, required = true, error, readOnly = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      required={required}
      readOnly={readOnly}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CollapsibleSection = ({ title, icon, children, isOpen, onToggle, isCompleted, disabled = false }) => (
  <div className={`border rounded-lg mb-5 ${isCompleted && !isOpen ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
    <button
      onClick={disabled ? null : onToggle}
      className={`w-full flex justify-between items-center p-4 text-left font-semibold
        ${isCompleted && !isOpen ? 'text-green-700' : 'text-gray-700'}
        ${isOpen ? 'rounded-t-lg bg-gray-50' : 'rounded-lg hover:bg-gray-50'}
        ${disabled ? 'cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      <div className="flex items-center">
        {icon && React.cloneElement(icon, { className: `mr-3 ${isCompleted && !isOpen ? 'text-green-600' : 'text-orange-500'}` })}
        {title}
        {isCompleted && !isOpen && <span className="ml-2 text-xs font-normal">(Completed)</span>}
      </div>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    {isOpen && <div className="p-5 border-t">{children}</div>}
  </div>
);

const CheckoutPage = ({ onBackToCart }) => {
  const { cartItems, totalPrice: cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const customerId = user?.id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({
    street_line: '', district: '', province: '', phone: user?.phone_number || ''
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({});

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(user?.phone_number || '');
  const [editPhoneNumberMode, setEditPhoneNumberMode] = useState(false);

  const [orderId, setOrderId] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [qrCodeString, setQrCodeString] = useState('');
  const [uniqueMd5, setUniqueMd5] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const MAX_POLLING_ATTEMPTS = 30;

  const [errors, setErrors] = useState({});

  const mockShippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 5.00, estimatedDelivery: '5-7 business days', type: 'standard' },
    { id: 'vet_express', name: 'VET Express', price: 2.50, estimatedDelivery: '1-2 business days', type: 'express' },
    { id: 'j_t_express', name: 'J&T Express', price: 3.00, estimatedDelivery: '2-3 business days', type: 'express' },
  ];

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddressForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleShippingAddressUpdate = (newPhone) => {
    setShippingAddress(prev => ({ ...prev, phone: newPhone }));
    setDisplayPhoneNumber(newPhone);
    setEditPhoneNumberMode(false);
  };

  const validateAddress = useCallback(() => {
    const addressToValidate = useNewAddress ? newAddressForm : shippingAddress;
    const newErrors = {};

    if (useNewAddress) {
      if (!addressToValidate.district) newErrors.district = 'District required';
      if (!addressToValidate.province) newErrors.province = 'Province required';
      if (!addressToValidate.phone) newErrors.phone = 'Phone number required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && (selectedAddressId !== null || (useNewAddress && newAddressForm.district && newAddressForm.province && newAddressForm.phone));
  }, [useNewAddress, newAddressForm, shippingAddress, selectedAddressId]);

  const startPollingPayment = useCallback((md5, orderId) => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      setPollingIntervalId(null);
    }

    setPollingAttempts(0);

    const interval = setInterval(async () => {
      setPollingAttempts(prev => prev + 1);
      const currentAttempt = pollingAttempts + 1;

      if (currentAttempt > MAX_POLLING_ATTEMPTS) {
        console.warn("Polling timed out. Payment not completed.");
        setPaymentStatus('failed');
        clearInterval(interval);
        setPollingIntervalId(null);
        return;
      }

      try {
        if (typeof apiService.checkPaymentStatus !== 'function') {
          console.error("apiService.checkPaymentStatus is not a function. Stopping polling.");
          setApiError("Payment check service is unavailable. Please try again later.");
          setPaymentStatus('failed');
          clearInterval(interval);
          setPollingIntervalId(null);
          return;
        }

        const response = await apiService.checkPaymentStatus(md5, orderId);

        if (response) {
          const { payment_status } = response;
          if (payment_status === 'Completed') {
            console.log("Payment successful!");
            setPaymentStatus('completed');
            clearInterval(interval);
            setPollingIntervalId(null);
            navigate('/checkout/success');
          } else if (payment_status === 'Pending') {
            console.log(`(Attempt ${currentAttempt}/${MAX_POLLING_ATTEMPTS}) Payment status: Pending`);
          } else {
            console.error(`Unexpected payment status: ${payment_status}. Stopping polling.`);
            setPaymentStatus('failed');
            clearInterval(interval);
            setPollingIntervalId(null);
          }
        }
      } catch (error) {
        console.error(`(Attempt ${currentAttempt}/${MAX_POLLING_ATTEMPTS}) Error checking payment status:`, error.message);
      }
    }, 5000);
    setPollingIntervalId(interval);
  }, [pollingIntervalId, pollingAttempts, navigate]);

  const initiatePaymentFlow = useCallback(async () => {
    if ((paymentStatus !== 'idle' && paymentStatus !== 'failed') || !customerId) {
      console.log("Payment process already initiated/completed, or customerId is missing. Not re-initiating.");
      if (!customerId) setApiError("Customer ID is missing. Please log in.");
      return;
    }

    if (paymentStatus === 'failed') {
      setPaymentStatus('idle');
      setQrCodeString('');
      setUniqueMd5('');
      setOrderId(null);
      setAmountToPay(0);
    }

    setLoading(true);
    setApiError(null);

    try {
      const addressIdForOrder = selectedAddressId;

      if (addressIdForOrder === null) {
        throw new Error("No shipping address selected. Please select an existing address or ensure new address is saved.");
      }

      const expressHandle = selectedShippingMethod?.type === 'express' ? selectedShippingMethod.name : null;

      console.log("Attempting to place order with Customer ID:", customerId, "Address ID:", addressIdForOrder, "Express Handle:", expressHandle);
      const placeOrderResponse = await apiService.placeOrder(customerId, addressIdForOrder, expressHandle);

      const orderData = placeOrderResponse;
      setOrderId(orderData.order_id);
      setAmountToPay(orderData.amount_pay);
      console.log(`Order placed. Order ID: ${orderData.order_id}, Amount: ${orderData.amount_pay}`);

      console.log("Generating KHQR...");
      const qrData = await apiService.getKhqr(
        parseInt(orderData.amount_pay),
        orderData.order_id,
        'KHR'
      );

      setQrCodeString(qrData.khqr_string);
      setUniqueMd5(qrData.unique_md5);
      setPaymentStatus('pending_payment');
      setLoading(false);
      console.log("KHQR generated. Starting payment polling...");

      startPollingPayment(qrData.unique_md5, qrData.order_id);

    } catch (error) {
      console.error("Error during checkout initiation:", error.message);
      setApiError(error.message || "An unexpected error occurred during checkout initiation.");
      setPaymentStatus('failed');
      setLoading(false);
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        setPollingIntervalId(null);
      }
    }
  }, [paymentStatus, customerId, selectedAddressId, selectedShippingMethod, startPollingPayment, pollingIntervalId]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!isAuthenticated || !customerId) {
        setApiError("Please log in to view and manage your addresses.");
        setLoading(false);
        return;
      }
      try {
        setApiError(null);
        setLoading(true);
        const addresses = await apiService.getAddressCustomer(customerId);

        setUserAddresses(addresses);

        if (addresses.length > 0 && selectedAddressId === null && !useNewAddress) {
          setSelectedAddressId(addresses[0].address_id);
        }
      } catch (err) {
        console.error("Failed to fetch user addresses:", err.message);
        setApiError(`Failed to load addresses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAddresses();
  }, [isAuthenticated, customerId, selectedAddressId, useNewAddress]);

  useEffect(() => {
    if (!selectedShippingMethod && mockShippingMethods.length > 0) {
      setSelectedShippingMethod(mockShippingMethods[0]);
    }

    if (useNewAddress) {
      setShippingAddress(newAddressForm);
      setDisplayPhoneNumber(newAddressForm.phone || user?.phone_number || '');
    } else if (selectedAddressId !== null) {
      const selected = userAddresses.find(addr => String(addr.address_id) === String(selectedAddressId));
      if (selected) {
        setShippingAddress(selected);
        setDisplayPhoneNumber(selected.phone || user?.phone_number || '');
      }
    } else if (userAddresses.length > 0 && selectedAddressId === null && !useNewAddress) {
      setShippingAddress(userAddresses[0]);
      setSelectedAddressId(userAddresses[0].address_id);
      setDisplayPhoneNumber(userAddresses[0].phone || user?.phone_number || '');
    } else if (!selectedAddressId && !useNewAddress && userAddresses.length === 0) {
        setDisplayPhoneNumber(user?.phone_number || '');
    }
  }, [selectedAddressId, useNewAddress, newAddressForm, userAddresses, selectedShippingMethod, user?.phone_number]);

  useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);

  useEffect(() => {
    if (currentStep === 3 && (paymentStatus === 'idle' || paymentStatus === 'failed')) {
      console.log("Entering payment step (3). Initiating payment flow...");
      initiatePaymentFlow();
    }
  }, [currentStep, paymentStatus, initiatePaymentFlow]);

  const STEPS_CONFIG = [
    { id: 1, name: 'Shipping Address', icon: <FaMapMarkerAlt size={20} /> },
    { id: 2, name: 'Shipping Method', icon: <FaShippingFast size={20} /> },
    { id: 3, name: 'Payment', icon: <FaCreditCard size={20} /> },
  ];

  const handleNextStep = async () => {
    setApiError(null);
    setLoading(true);

    if (currentStep === 1) {
      if (!validateAddress()) {
        console.log("Address validation failed.");
        setLoading(false);
        return;
      }

      if (useNewAddress) {
        try {
          await apiService.addAddressCustomer(customerId, {
            street_line: newAddressForm.street_line,
            commune: '', 
            district: newAddressForm.district,
            province: newAddressForm.province,
            google_map_link: null, 
          });
          console.log("New address added to backend. Re-fetching addresses...");

          const updatedAddresses = await apiService.getAddressCustomer(customerId);
          setUserAddresses(updatedAddresses);

          const newlyAddedAddress = updatedAddresses.find(
            addr => addr.street_line === newAddressForm.street_line &&
                    addr.district === newAddressForm.district &&
                    addr.province === newAddressForm.province &&
                    (addr.phone === newAddressForm.phone || !newAddressForm.phone)
          );

          if (newlyAddedAddress) {
            setSelectedAddressId(newlyAddedAddress.address_id);
          } else if (updatedAddresses.length > 0) {
            setSelectedAddressId(updatedAddresses[0].address_id);
          }


          setUseNewAddress(false);
          setNewAddressForm({
            street_line: '', district: '', province: '', phone: user?.phone_number || ''
          });
          setCurrentStep(2);
        } catch (err) {
          console.error("Failed to add new address:", err.message);
          setApiError(`Failed to add new address: ${err.message}`);
          setLoading(false);
          return;
        }
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!selectedShippingMethod) {
        alert("Please select a shipping method.");
        setLoading(false);
        return;
      }

      setCurrentStep(3);
    } else if (currentStep === 3) {
        if (paymentStatus === 'failed') {
            initiatePaymentFlow();
        }
    }
    setLoading(false);
  };


  const orderSubtotal = cartTotal;
  const shippingCost = selectedShippingMethod?.price || 0;
  const tax = orderSubtotal * 0.07;
  const finalTotal = orderSubtotal + shippingCost + tax;

  const customerNameForKhqr = user?.name || "Customer";


  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-md max-w-md mx-auto mt-20">
        <FaLock className="text-6xl text-orange-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Please Log In</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to proceed to checkout.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading && currentStep < 3) return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
  if (!cartItems) return <div className="p-8 text-center">Loading checkout...</div>;
  if (cartItems.length === 0 && currentStep <= STEPS_CONFIG.length) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-md max-w-md mx-auto mt-20">
        <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {onBackToCart && (
          <button onClick={onBackToCart} className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500 mb-5 font-medium">
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <CheckoutStepper currentStep={currentStep} steps={STEPS_CONFIG} />

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {apiError}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="lg:w-[60%]">
            <CollapsibleSection
              title="1. Shipping Address"
              icon={<FaMapMarkerAlt size={18} />}
              isOpen={currentStep === 1}
              onToggle={() => setCurrentStep(1)}
              isCompleted={currentStep > 1 && Object.keys(errors).length === 0 && (useNewAddress ? newAddressForm.street_line && newAddressForm.phone : selectedAddressId !== null)}
              disabled={currentStep !== 1}
            >
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Choose an existing address or add a new one:</h4>
                {userAddresses.length > 0 ? (
                  <div className="space-y-2">
                    {userAddresses.map(addr => (
                      <label key={addr.address_id} className={`flex items-center p-3.5 border rounded-md cursor-pointer hover:border-orange-400
                        ${String(selectedAddressId) === String(addr.address_id) && !useNewAddress ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                        <input
                          type="radio" name="addressSelection" value={addr.address_id}
                          checked={String(selectedAddressId) === String(addr.address_id) && !useNewAddress}
                          onChange={() => { setSelectedAddressId(addr.address_id); setUseNewAddress(false); }}
                          className="form-radio h-4 w-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {addr.street_line}, {addr.district}, {addr.province}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                    <p className="text-gray-500 text-sm mb-4">No saved addresses found. Please add a new address.</p>
                  )}
                <label className={`flex items-center p-3.5 border rounded-md cursor-pointer mt-3 hover:border-orange-400
                  ${useNewAddress ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                  <input
                    type="radio" name="addressSelection" value="new"
                    checked={useNewAddress}
                    onChange={() => {
                      setUseNewAddress(true);
                      setSelectedAddressId(null);
                    }}
                    className="form-radio h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Add a new address</span>
                </label>
              </div>

              {(useNewAddress || userAddresses.length === 0) && (
                <>
                  <p className="text-xs text-gray-500 mb-4">You can create an account after checkout.</p>
                  <InputField label="Street Line" id="street_line" name="street_line" value={newAddressForm.street_line} onChange={handleAddressInputChange} error={errors.street_line} required={false} />
                  <InputField label="District" id="district" name="district" value={newAddressForm.district} onChange={handleAddressInputChange} error={errors.district} />
                  <InputField label="Province" id="province" name="province" value={newAddressForm.province} onChange={handleAddressInputChange} error={errors.province} />
                  <InputField label="Phone Number" id="phone" name="phone" type="tel" placeholder="(012) 345-6789" value={newAddressForm.phone} onChange={handleAddressInputChange} error={errors.phone} />
                </>
              )}
              {currentStep === 1 && (
                <button onClick={handleNextStep} className="mt-3 w-full sm:w-auto bg-orange-500 text-white px-7 py-2.5 rounded-md font-semibold hover:bg-orange-600 text-sm" disabled={loading}>
                  {loading ? 'Saving Address...' : 'Continue to Shipping'}
                </button>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              title="2. Shipping Method"
              icon={<FaShippingFast size={18} />}
              isOpen={currentStep === 2}
              onToggle={() => setCurrentStep(2)}
              isCompleted={currentStep > 2}
              disabled={currentStep < 2}
            >
              <div className="space-y-3 mb-4">
                {mockShippingMethods.map(method => (
                  <label key={method.id} className={`flex items-center p-3.5 border rounded-md cursor-pointer hover:border-orange-400
                    ${selectedShippingMethod?.id === method.id ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shippingMethod" value={method.id}
                      checked={selectedShippingMethod?.id === method.id}
                      onChange={() => setSelectedShippingMethod(method)}
                      className="form-radio h-4 w-4 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-3 text-sm font-medium text-gray-700 flex-grow">{method.name} ({method.estimatedDelivery})</span>
                    <span className="text-sm text-gray-600">${method.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaMobileAlt className="mr-2" /> Contact Phone Number</h4>
                {!editPhoneNumberMode ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-800">{displayPhoneNumber || 'No phone number provided'}</span>
                    <button
                      onClick={() => setEditPhoneNumberMode(true)}
                      className="text-orange-500 hover:underline text-sm ml-4"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                    <div className="flex items-end gap-2">
                      <InputField
                        label="New Phone Number"
                        id="displayPhoneNumber"
                        name="displayPhoneNumber"
                        type="tel"
                        placeholder="(012) 345-6789"
                        value={displayPhoneNumber}
                        onChange={(e) => setDisplayPhoneNumber(e.target.value)}
                        required={true}
                      />
                      <button
                        onClick={() => handleShippingAddressUpdate(displayPhoneNumber)}
                        className="bg-green-500 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-green-600 text-sm h-fit mb-4"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setDisplayPhoneNumber(shippingAddress.phone || user?.phone_number || ''); setEditPhoneNumberMode(false); }}
                        className="bg-gray-300 text-gray-800 px-4 py-2.5 rounded-md font-semibold hover:bg-gray-400 text-sm h-fit mb-4"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </div>

              {currentStep === 2 && (
                <button onClick={handleNextStep} className="mt-5 w-full sm:w-auto bg-orange-500 text-white px-7 py-2.5 rounded-md font-semibold hover:bg-orange-600 text-sm"
                  disabled={editPhoneNumberMode || !displayPhoneNumber || loading}>
                  {loading ? 'Loading...' : 'Continue to Payment'}
                </button>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              title="3. Payment Details"
              icon={<FaCreditCard size={18} />}
              isOpen={currentStep === 3}
              onToggle={() => setCurrentStep(3)}
              isCompleted={paymentStatus === 'completed'}
              disabled={currentStep < 3}
            >
              <p className="text-sm text-gray-600 mb-4">Scan the KHQR code to complete your payment. All transactions are secure and encrypted.</p>

              <div className="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Scan to Pay with KHQR</h4>

                {paymentStatus === 'idle' && (
                  <div className="text-gray-600 text-center py-10">
                    Preparing QR code...
                  </div>
                )}
                {paymentStatus === 'generating_qr' && (
                  <div className="text-gray-600 text-center py-10">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4" style={{ borderTopColor: '#f97316' }}></div>
                    Generating QR code...
                  </div>
                )}
                {paymentStatus === 'pending_payment' && qrCodeString ? (
                  <Khqr name={customerNameForKhqr} amount={finalTotal} qrValue={qrCodeString} />
                ) : (
                    paymentStatus === 'failed' && (
                      <div className="text-gray-500 text-center py-10">QR code not available or an error occurred.</div>
                    )
                  )}

                {paymentStatus === 'pending_payment' && (
                  <p className="mt-4 text-center text-gray-600 font-semibold">
                    Please scan the QR code above to complete the payment.
                    <br />Waiting for payment confirmation...
                  </p>
                )}
                {paymentStatus === 'failed' && (
                  <p className="mt-4 text-center text-red-600 font-semibold">
                    Payment failed or timed out. Please retry.
                  </p>
                )}
                {paymentStatus === 'completed' && (
                  <p className="mt-4 text-center text-green-600 font-semibold">
                    Payment successfully processed! Redirecting to success page...
                  </p>
                )}
              </div>

              {currentStep === 3 && paymentStatus === 'failed' && (
                <button onClick={() => {
                  setPaymentStatus('idle');
                  setQrCodeString('');
                  setUniqueMd5('');
                  setOrderId(null);
                  setAmountToPay(0);
                  setApiError(null);
                  initiatePaymentFlow();
                }}
                  className="mt-5 w-full bg-red-500 text-white px-7 py-3 rounded-md font-semibold hover:bg-red-600 text-sm">
                  Retry Payment
                </button>
              )}
            </CollapsibleSection>
          </div>

          <div className="lg:w-[40%]">
            <OrderSummaryCheckout shippingCost={shippingCost} currency="KHR" />
            <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs flex items-center">
              <FaLock className="mr-2 flex-shrink-0" /> Your information is safe. Secure SSL encrypted checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
