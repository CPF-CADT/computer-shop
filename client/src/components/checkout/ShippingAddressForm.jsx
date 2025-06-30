// src/components/checkout/ShippingAddressForm.js
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const InputField = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm`}
      required={required}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ShippingAddressForm = ({ onNext, initialData = {} }) => {
  const [formData, setFormData] = useState({
    address: initialData.address || '',
    city: initialData.city || '',
    stateProvince: initialData.stateProvince || '',
    country: initialData.country || 'United States',
  });

  const [errors, setErrors] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.stateProvince.trim()) newErrors.stateProvince = 'State/Province is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData); // Pass data to parent
      setIsCollapsed(true); // Collapse after successful submission
    } else {
      setIsCollapsed(false); // Keep open on error
    }
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-gray-700">Shipping Address</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <p className="text-xs text-gray-500">You can create an account after checkout.</p>

          <InputField
            label="Street Address"
            id="address"
            placeholder="123 Main St, Apt 4B"
            value={formData.address}
            onChange={handleChange}
            required
            error={errors.address}
          />

          <InputField
            label="City"
            id="city"
            placeholder="Anytown"
            value={formData.city}
            onChange={handleChange}
            required
            error={errors.city}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stateProvince" className="block text-xs font-medium text-gray-700 mb-1">
                State/Province <span className="text-red-500">*</span>
              </label>
              <select
                id="stateProvince"
                name="stateProvince"
                value={formData.stateProvince}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border ${
                  errors.stateProvince ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm`}
              >
                <option value="">Please, select a region, state or province</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                {/* Add more states/provinces as needed */}
              </select>
              {errors.stateProvince && (
                <p className="text-red-500 text-xs mt-1">{errors.stateProvince}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm`}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              {/* Add more countries as needed */}
            </select>
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>

          <button
            type="submit"
            className="w-auto bg-brand-orange text-yellow-300 px-8 py-2.5 rounded-md font-semibold hover:bg-brand-orange-dark"
          >
            Next
          </button>
        </form>
      )}
    </div>
  );
};

export default ShippingAddressForm;
