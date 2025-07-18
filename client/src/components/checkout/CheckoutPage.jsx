import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaLock, FaChevronDown, FaChevronUp, FaCreditCard, FaShippingFast, FaMapMarkerAlt, FaMobileAlt } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { useNavigate } from 'react-router-dom'; // Keep useNavigate
import CheckoutStepper from './CheckoutStepper';
import OrderSummaryCheckout from './OrderSummaryCheckout';
import Khqr from './Khqr';
// import SuccessPage from './SuccessPage'; // No longer needed for direct rendering
import axios from 'axios';

// --- Configuration ---
const BASE_URL = 'http://localhost:3000/api';
const CUSTOMER_ID = 12;
const CUSTOMER_PHONE = '096484190'

const mockShippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 5.00, estimatedDelivery: '5-7 business days', type: 'standard' },
  { id: 'vet_express', name: 'VET Express', price: 2.50, estimatedDelivery: '1-2 business days', type: 'express' },
  { id: 'j_t_express', name: 'J&T Express', price: 3.00, estimatedDelivery: '2-3 business days', type: 'express' },
];

// --- Reusable InputField ---
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

// --- Collapsible Section Component ---
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
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate(); // Used for redirection now

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --- Address State ---
  const [userAddresses, setUserAddresses] = useState([]); // Fetched from API
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({
    street_line: '', commune: '', district: '', province: '', zipCode: '', country: 'Cambodia', phone: ''
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({});

  // --- Shipping Method State ---
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(CUSTOMER_PHONE);
  const [editPhoneNumberMode, setEditPhoneNumberMode] = useState(false);

  // --- Payment State ---
  const [orderId, setOrderId] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [qrCodeString, setQrCodeString] = useState('');
  const [uniqueMd5, setUniqueMd5] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'generating_qr', 'pending_payment', 'completed', 'failed'
  const [pollingIntervalId, setPollingIntervalId] = useState(null);

  const [errors, setErrors] = useState({});

  // --- Data Fetching and Initialization ---

  // Fetch user addresses on component mount
  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        setApiError(null); // Clear previous errors
        const response = await axios.get(`${BASE_URL}/address-customer/${CUSTOMER_ID}`);

        const addresses = response.data.data || [];
        setUserAddresses(addresses);

        // Set the first address as default if none selected initially and addresses are available
        if (addresses.length > 0 && selectedAddressId === null) {
          setSelectedAddressId(addresses[0].address_id);
        }
      } catch (err) {
        console.error("Failed to fetch user addresses:", err.response?.data?.message || err.message);
        setApiError("Failed to load addresses. Please ensure your backend is running and the API endpoint is correct.");
      }
    };
    fetchUserAddresses();
  }, [CUSTOMER_ID, selectedAddressId]);

  // Update shippingAddress and displayPhoneNumber when selection/input changes
  useEffect(() => {
    // Select first shipping method by default if not already selected
    if (!selectedShippingMethod && mockShippingMethods.length > 0) {
      setSelectedShippingMethod(mockShippingMethods[0]);
    }

    if (useNewAddress) {
      setShippingAddress(newAddressForm);
      setDisplayPhoneNumber(newAddressForm.phone || '');
    } else if (selectedAddressId !== null) {
      const selected = userAddresses.find(addr => String(addr.address_id) === String(selectedAddressId));
      if (selected) {
        setShippingAddress(selected);
      }
    } else if (userAddresses.length > 0 && selectedAddressId === null && !useNewAddress) {
      setShippingAddress(userAddresses[0]);
      setSelectedAddressId(userAddresses[0].address_id);
    }
  }, [selectedAddressId, useNewAddress, newAddressForm, userAddresses, selectedShippingMethod]);

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);


  // --- New useEffect to trigger QR generation when entering Step 3 ---
  useEffect(() => {
    // Only attempt to initiate payment if on step 3
    // and payment hasn't already started or completed.
    if (currentStep === 3 && (paymentStatus === 'idle' || paymentStatus === 'failed')) {
      console.log("Entering payment step (3). Initiating payment flow...");
      initiatePaymentFlow();
    }
  }, [currentStep, paymentStatus]);

  // --- Handlers ---

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
      if (!addressToValidate.street_line) newErrors.street_line = 'Street line required';
      if (!addressToValidate.district) newErrors.district = 'District required';
      if (!addressToValidate.province) newErrors.province = 'Province required';
      if (!addressToValidate.phone) newErrors.phone = 'Phone number required';
    } else {
      if (!addressToValidate.street_line) newErrors.street_line = 'Street line required';
      if (!addressToValidate.district) newErrors.district = 'District required';
      if (!addressToValidate.province) newErrors.province = 'Province required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && (selectedAddressId !== null || (useNewAddress && newAddressForm.street_line && newAddressForm.phone));
  }, [useNewAddress, newAddressForm, shippingAddress, selectedAddressId]);

  // Function to start polling for payment status
  const startPollingPayment = useCallback((md5, orderId) => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }

    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 5 seconds = 150 seconds (2.5 minutes)

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        console.warn("Polling timed out. Payment not completed.");
        setPaymentStatus('failed');
        clearInterval(interval);
        return;
      }

      try {
        const response = await axios.post(`${BASE_URL}/checkout/check-payment`, {
          unique_md5: md5,
          order_id: orderId
        });

        if (response.status === 200) {
          const { payment_status } = response.data;
          if (payment_status === 'Completed') {
            console.log("Payment successful!");
            setPaymentStatus('completed');
            clearInterval(interval);
            clearCart(); 
            navigate('/checkout/success'); 
          } else if (payment_status === 'Pending') {
            console.log(`(Attempt ${attempts}/${maxAttempts}) Payment status: Pending`);
          } else {
            console.error(`Unexpected payment status: ${payment_status}`);
            setPaymentStatus('failed');
            clearInterval(interval);
          }
        } else {
          console.error(`Check payment request failed with status ${response.status}`);
          setPaymentStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus('failed');
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
    setPollingIntervalId(interval);
  }, [pollingIntervalId, clearCart, navigate]); // Re-added 'navigate' to dependencies


  // --- Cart Synchronization ---
  const syncCartToBackend = async () => {
    setLoading(true);
    setApiError(null);
    try {
      for (const item of cartItems) {
        const productResponse = await axios.get(`${BASE_URL}/product/${item.product_code}`);
        const productData = productResponse.data;
        let price = productData.price.amount;

        if (productData.discount) {
          const discountType = productData.discount.type;
          const discountValue = productData.discount.value || 0;
          if (discountType === 'Percentage') {
            price *= (1 - discountValue / 100);
          } else if (discountType === 'Fixed Amount') {
            price -= discountValue;
          }
          price = Math.max(price, 0);
        }

        await axios.post(`${BASE_URL}/cart-item/${CUSTOMER_ID}`, {
          customer_id: CUSTOMER_ID,
          product_code: item.product_code,
          qty: item.qty,
          price_at_purchase: parseFloat(price.toFixed(2)),
        });
      }
      console.log("Frontend cart synced to backend successfully.");
      return true;
    } catch (err) {
      console.error("Failed to sync cart to backend:", err.response?.data?.message || err.message);
      setApiError(`Failed to sync cart data: ${err.response?.data?.message || 'Please check console for details.'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const STEPS_CONFIG = [
    { id: 1, name: 'Shipping Address', icon: <FaMapMarkerAlt size={20} /> },
    { id: 2, name: 'Shipping Method', icon: <FaShippingFast size={20} /> },
    { id: 3, name: 'Payment', icon: <FaCreditCard size={20} /> },
  ];

  const handleNextStep = async () => {
    setApiError(null); // Clear previous errors

    if (currentStep === 1) {
      if (!validateAddress()) {
        console.log("Address validation failed.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedShippingMethod) {
        alert("Please select a shipping method.");
        return;
      }

      // Sync cart data to backend before moving to payment
      setLoading(true); // Indicate loading while syncing cart
      const cartSynced = await syncCartToBackend();
      setLoading(false);

      if (!cartSynced) {
        alert("Could not proceed to payment: Failed to sync cart data.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
        if (paymentStatus === 'failed') {
            // If payment failed, allow retry
            initiatePaymentFlow();
        }
    }
  };

  // New function to encapsulate the payment initiation logic
  const initiatePaymentFlow = useCallback(async () => {
    // Prevent re-triggering if already in process or completed
    if (paymentStatus === 'generating_qr' || paymentStatus === 'pending_payment' || paymentStatus === 'completed') {
      console.log("Payment process already initiated or completed.");
      return;
    }

    setPaymentStatus('generating_qr'); // Set status to show QR generation loading
    setLoading(true); // Main loading for API calls

    try {
      const addressIdForOrder = selectedAddressId;

      if (addressIdForOrder === null) {
        throw new Error("No shipping address selected. Please select an existing address or ensure new address is saved.");
      }

      // 1. Place Order API Call
      console.log("Attempting to place order with Customer ID:", CUSTOMER_ID, "and Address ID:", addressIdForOrder);
      const placeOrderResponse = await axios.post(`${BASE_URL}/checkout/place-order`, {
        customer_id: CUSTOMER_ID,
        address_id: addressIdForOrder,
      });

      if (placeOrderResponse.status !== 200) {
        throw new Error(`Place order failed: ${placeOrderResponse.status} - ${placeOrderResponse.data.message || 'Unknown error'}`);
      }

      const orderData = placeOrderResponse.data;
      setOrderId(orderData.order_id);
      setAmountToPay(orderData.amount_pay);
      console.log(`Order placed. Order ID: ${orderData.order_id}, Amount: ${orderData.amount_pay}`);

      // 2. Generate KHQR API Call
      console.log("Generating KHQR...");
      const getKhqrResponse = await axios.post(`${BASE_URL}/checkout/get-khqr`, {
        amount_pay: parseInt(orderData.amount_pay),
        order_id: orderData.order_id,
        typeCurrency: 'KHR' // Or 'USD' based on your requirement
      });

      if (getKhqrResponse.status !== 200) {
        throw new Error(`Get KHQR failed: ${getKhqrResponse.status} - ${getKhqrResponse.data.message || 'Unknown error'}`);
      }

      const qrData = getKhqrResponse.data;
      setQrCodeString(qrData.khqr_string);
      setUniqueMd5(qrData.unique_md5);
      setPaymentStatus('pending_payment'); // Now waiting for actual payment
      setLoading(false); // Stop main loading indicator for API calls
      console.log("KHQR generated. Starting payment polling...");

      // 3. Start Polling for Payment Status
      startPollingPayment(qrData.unique_md5, qrData.order_id);

    } catch (error) {
      console.error("Error during checkout:", error.response?.data?.message || error.message);
      setApiError(error.response?.data?.message || error.message || "An unexpected error occurred during checkout.");
      setPaymentStatus('failed'); // Set status to failed
      setLoading(false); // Stop loading indicator
    }
  }, [paymentStatus, selectedAddressId, startPollingPayment]);

  const orderSubtotal = cartTotal;
  const shippingCost = selectedShippingMethod?.price || 0;
  const tax = orderSubtotal * 0.07; // Example 7% tax
  const finalTotal = orderSubtotal + shippingCost + tax;

  const customerNameForKhqr = "Customer";


  if (!cartItems) return <div className="p-8 text-center">Loading checkout...</div>;
  if (cartItems.length === 0 && currentStep <= STEPS_CONFIG.length) {
    return <div className="p-8 text-center">Your cart is empty. <button onClick={onBackToCart} className="text-orange-500 hover:underline">Return to cart</button></div>;
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
          {/* Left Side: Checkout Steps */}
          <div className="lg:w-[60%]">
            {/* --- Shipping Address --- */}
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
                          {addr.commune ? `, ${addr.commune}` : ''}
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
                      setSelectedAddressId(null); // Deselect existing address when adding new
                    }}
                    className="form-radio h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Add a new address</span>
                </label>
              </div>

              {(useNewAddress || userAddresses.length === 0) && (
                <>
                  <p className="text-xs text-gray-500 mb-4">You can create an account after checkout.</p>
                  <InputField label="Street Line" id="street_line" name="street_line" value={newAddressForm.street_line} onChange={handleAddressInputChange} error={errors.street_line} />
                  <InputField label="Commune" id="commune" name="commune" value={newAddressForm.commune} onChange={handleAddressInputChange} error={errors.commune} />
                  <InputField label="District" id="district" name="district" value={newAddressForm.district} onChange={handleAddressInputChange} error={errors.district} />
                  <InputField label="Province" id="province" name="province" value={newAddressForm.province} onChange={handleAddressInputChange} error={errors.province} />
                  <InputField label="Zip/Postal Code" id="zipCode" name="zipCode" value={newAddressForm.zipCode} onChange={handleAddressInputChange} error={errors.zipCode} />
                  <InputField label="Country" id="country" name="country" value={newAddressForm.country} onChange={handleAddressInputChange} error={errors.country} />
                  <InputField label="Phone Number" id="phone" name="phone" type="tel" placeholder="(012) 345-6789" value={newAddressForm.phone} onChange={handleAddressInputChange} error={errors.phone} />
                </>
              )}
              {currentStep === 1 && (
                <button onClick={handleNextStep} className="mt-3 w-full sm:w-auto bg-orange-500 text-white px-7 py-2.5 rounded-md font-semibold hover:bg-orange-600 text-sm">
                  Continue to Shipping
                </button>
              )}
            </CollapsibleSection>

            {/* --- Shipping Method --- */}
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
                    <span className="text-sm text-gray-600">{method.price.toFixed(2)} KHR</span> {/* Display in KHR */}
                  </label>
                ))}
              </div>

              {/* User Phone Number Display and Edit */}
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
                        onClick={() => { setDisplayPhoneNumber(shippingAddress.phone || ''); setEditPhoneNumberMode(false); }}
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
                  {loading ? 'Syncing Cart...' : 'Continue to Payment'}
                </button>
              )}
            </CollapsibleSection>

            {/* --- Payment Method --- */}
            <CollapsibleSection
              title="3. Payment Details"
              icon={<FaCreditCard size={18} />}
              isOpen={currentStep === 3}
              onToggle={() => setCurrentStep(3)}
              isCompleted={paymentStatus === 'completed'}
              disabled={currentStep < 3}
            >
              <p className="text-sm text-gray-600 mb-4">Scan the KHQR code to complete your payment. All transactions are secure and encrypted.</p>

              {/* KHQR Display Area */}
              <div className="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                <h4 className="font-semibold text-gray-700 mb-4">Scan to Pay with KHQR</h4>

                {/* Conditional Rendering for Payment Status */}
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
                    // Removed the condition for paymentStatus === 'completed' to render SuccessPage directly
                    paymentStatus !== 'generating_qr' && paymentStatus !== 'idle' && paymentStatus !== 'completed' && ( // Added paymentStatus !== 'completed' here
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

              {/* Only show retry button if payment failed */}
              {currentStep === 3 && paymentStatus === 'failed' && (
                <button onClick={() => {
                  setPaymentStatus('idle'); // Reset state to idle to allow retry
                  setQrCodeString('');
                  setUniqueMd5('');
                  setOrderId(null);
                  setAmountToPay(0);
                  setApiError(null);
                  initiatePaymentFlow(); // Immediately try again
                }}
                  className="mt-5 w-full bg-red-500 text-white px-7 py-3 rounded-md font-semibold hover:bg-red-600 text-sm">
                  Retry Payment
                </button>
              )}
            </CollapsibleSection>
          </div>

          {/* Right Side: Order Summary */}
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