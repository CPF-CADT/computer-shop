// src/components/ui/CheckoutPage.js
import React, { useState } from 'react';
import { FaArrowLeft, FaLock, FaChevronDown, FaChevronUp, FaCreditCard, FaShippingFast } from 'react-icons/fa';
import { useCart } from '../cart/CartContext'; // Assuming CartContext is in the right place
import { mockShippingMethods } from '../../data/mockData';

// --- Reusable InputField (can be a separate component) ---
const InputField = ({ label, id, type = "text", placeholder, value, onChange, required = true, error }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400`}
      required={required}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// --- Collapsible Section Component ---
const CollapsibleSection = ({ title, icon, children, isOpen, onToggle, isCompleted }) => (
    <div className={`border rounded-lg mb-5 ${isCompleted && !isOpen ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
        <button
            onClick={onToggle}
            className={`w-full flex justify-between items-center p-4 text-left font-semibold 
                ${isCompleted && !isOpen ? 'text-green-700' : 'text-gray-700'}
                ${isOpen ? 'rounded-t-lg bg-gray-50' : 'rounded-lg hover:bg-gray-50'}`}
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


const CheckoutPage = ({ onBackToCart, onOrderPlaced }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Shipping, 3: Payment

  const [shippingAddress, setShippingAddress] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', zipCode: '', country: 'United States', phone: ''
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(mockShippingMethods[0]);
  const [paymentDetails, setPaymentDetails] = useState({cardNumber: '', expiryDate: '', cvv: ''});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null })); // Clear error on change
  };

  const validateAddress = () => { /* Basic validation logic */
    const newErrors = {};
    if (!shippingAddress.email.includes('@')) newErrors.email = 'Invalid email';
    if (!shippingAddress.firstName) newErrors.firstName = 'First name required';
    if (!shippingAddress.address) newErrors.address = 'Address required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Add validatePayment if needed

  const STEPS_CONFIG = [
    { id: 1, name: 'Shipping Address', icon: <FaShippingFast size={20}/> },
    { id: 2, name: 'Shipping Method', icon: <FaShippingFast size={20}/> },
    { id: 3, name: 'Payment', icon: <FaCreditCard size={20}/> },
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && !validateAddress()) return;
    if (currentStep < STEPS_CONFIG.length) {
        setCurrentStep(s => s + 1);
    } else if (currentStep === STEPS_CONFIG.length) { // Payment step, attempt to place order
        if (!agreedToTerms) {
            alert("Please agree to terms and conditions.");
            return;
        }
        console.log("Placing Order:", { shippingAddress, selectedShippingMethod, paymentDetails, cartItems });
        if(onOrderPlaced) onOrderPlaced({ shippingAddress, selectedShippingMethod, paymentDetails, cart: cartItems });
        clearCart(); // Clear cart after placing order
        alert("Order placed successfully! (Simulated)");
        // Navigate to an order confirmation page (to be handled by parent app)
    }
  };

  const orderSubtotal = cartTotal;
  const shippingCost = selectedShippingMethod?.price || 0;
  const tax = orderSubtotal * 0.07; // Example 7% tax
  const finalTotal = orderSubtotal + shippingCost + tax;

  if (!cartItems) return <div className="p-8 text-center">Loading checkout...</div>;
  if (cartItems.length === 0 && currentStep < STEPS_CONFIG.length +1) { // Don't show if order is "placed"
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

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Side: Checkout Steps */}
          <div className="lg:w-[60%]">
            {/* --- Shipping Address --- */}
            <CollapsibleSection 
                title="1. Shipping Address" 
                icon={<FaShippingFast size={18}/>}
                isOpen={currentStep === 1} 
                onToggle={() => setCurrentStep(prev => prev === 1 ? 0 : 1)}
                isCompleted={currentStep > 1 && Object.keys(errors).length === 0} // Simplistic completion check
            >
              <InputField label="Email" id="email" name="email" type="email" value={shippingAddress.email} onChange={(e)=>handleInputChange(e, setShippingAddress)} error={errors.email} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InputField label="First Name" id="firstName" name="firstName" value={shippingAddress.firstName} onChange={(e)=>handleInputChange(e, setShippingAddress)} error={errors.firstName}/>
                <InputField label="Last Name" id="lastName" name="lastName" value={shippingAddress.lastName} onChange={(e)=>handleInputChange(e, setShippingAddress)} />
              </div>
              <InputField label="Street Address" id="address" name="address" value={shippingAddress.address} onChange={(e)=>handleInputChange(e, setShippingAddress)} error={errors.address}/>
              {/* Add City, Zip, Country, Phone similar to InputField */}
              <button onClick={handleNextStep} className="mt-3 w-full sm:w-auto bg-orange-500 text-white px-7 py-2.5 rounded-md font-semibold hover:bg-orange-600 text-sm">
                Continue to Shipping
              </button>
            </CollapsibleSection>

            {/* --- Shipping Method --- */}
            <CollapsibleSection 
                title="2. Shipping Method" 
                icon={<FaShippingFast size={18}/>}
                isOpen={currentStep === 2} 
                onToggle={() => setCurrentStep(prev => prev === 2 ? 0 : 2)}
                isCompleted={currentStep > 2}
            >
              <div className="space-y-3">
                {mockShippingMethods.map(method => (
                  <label key={method.id} className={`flex items-center p-3.5 border rounded-md cursor-pointer hover:border-orange-400
                    ${selectedShippingMethod?.id === method.id ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                    <input type="radio" name="shippingMethod" value={method.id}
                           checked={selectedShippingMethod?.id === method.id}
                           onChange={() => setSelectedShippingMethod(method)}
                           className="form-radio h-4 w-4 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-3 text-sm font-medium text-gray-700 flex-grow">{method.name}</span>
                    <span className="text-sm text-gray-600 font-medium">${method.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleNextStep} className="mt-5 w-full sm:w-auto bg-orange-500 text-white px-7 py-2.5 rounded-md font-semibold hover:bg-orange-600 text-sm">
                Continue to Payment
              </button>
            </CollapsibleSection>

            {/* --- Payment Method --- */}
            <CollapsibleSection 
                title="3. Payment Details" 
                icon={<FaCreditCard size={18}/>}
                isOpen={currentStep === 3} 
                onToggle={() => setCurrentStep(prev => prev === 3 ? 0 : 3)}
                isCompleted={false} // Payment is never marked "completed" until order is placed
            >
                <p className="text-sm text-gray-600 mb-4">Enter your payment information. All transactions are secure and encrypted.</p>
                <InputField label="Card Number" id="cardNumber" name="cardNumber" placeholder="•••• •••• •••• ••••" value={paymentDetails.cardNumber} onChange={(e)=>handleInputChange(e, setPaymentDetails)} />
                <div className="grid grid-cols-2 gap-x-4">
                    <InputField label="Expiry Date (MM/YY)" id="expiryDate" name="expiryDate" placeholder="MM/YY" value={paymentDetails.expiryDate} onChange={(e)=>handleInputChange(e, setPaymentDetails)} />
                    <InputField label="CVV" id="cvv" name="cvv" placeholder="•••" value={paymentDetails.cvv} onChange={(e)=>handleInputChange(e, setPaymentDetails)} />
                </div>
                <div className="mt-4">
                    <label className="flex items-center text-xs text-gray-600">
                        <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="form-checkbox h-3.5 w-3.5 text-orange-600 rounded focus:ring-orange-500"/>
                        <span className="ml-2">I agree to the <a href="#" className="text-orange-500 hover:underline">Terms and Conditions</a>.</span>
                    </label>
                </div>
                <button onClick={handleNextStep} disabled={!agreedToTerms} className="mt-5 w-full bg-green-500 text-white px-7 py-3 rounded-md font-semibold hover:bg-green-600 text-sm disabled:opacity-60">
                    Place Order
                </button>
            </CollapsibleSection>

          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[40%]">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-md sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2.5">Order Summary</h3>
              <div className="max-h-60 overflow-y-auto mb-3 pr-1 space-y-2.5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded mr-2.5 border"/>
                        <div>
                            <p className="font-medium text-gray-700 leading-tight">{item.name} (x{item.qty})</p>
                            <p className="text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-sm text-gray-700 mt-4 pt-3 border-t">
                <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">${orderSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span className="font-medium">${shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (Est.):</span><span className="font-medium">${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2.5 border-t mt-2.5">
                  <span>Total:</span><span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
               <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs flex items-center">
                <FaLock className="mr-2 flex-shrink-0"/> Your information is safe. Secure SSL encrypted checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;