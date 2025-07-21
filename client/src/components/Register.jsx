import { useState } from 'react';
import { apiService } from '../service/api'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // To navigate after successful registration
import { useAuth } from './context/AuthContext'; // Import useAuth to access the login function

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(''); // Corresponds to phone_number in API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // To display success message

  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true); // Set loading state

    try {
      // Call the userRegister API
      // Assuming apiService.userRegister now returns { success, message, token, user }
      const response = await apiService.userRegister(name, phone, password);
      console.log('Registration successful:', response);

      // IMPORTANT: Check if both token and user data are present in the response
      if (response && response.token && response.user) {
        // Automatically log in the user using the AuthContext's login function
        login(response);
        setSuccessMessage('Registration successful! Redirecting to main page...');
        // Redirect immediately to the main page
        navigate('/');
      } else {
        // This case might mean your API response was malformed or missing data
        setError('Registration failed: Invalid response from server. Missing token or user data.');
      }

    } catch (err) {
      console.error('Registration error:', err);
      // Display a user-friendly error message
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start p-4 pt-16">
      {/* Position form at top center with proper spacing */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-6">
        {/* Animated hook icon */}
        <div className="flex justify-center mb-2">
          <svg
            className="animate-bounce"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M24 44c-8.837 0-16-7.163-16-16V16a8 8 0 1116 0v12a4 4 0 108 0V16a1 1 0 112 0v12a6 6 0 11-12 0V16a6 6 0 10-12 0v12c0 7.732 6.268 14 14 14s14-6.268 14-14V16a1 1 0 10-2 0v12c0 8.837-7.163 16-16 16z"
              fill="#FFA726"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-1 text-center">
          Create your account
        </h2>
        <p className="text-xs text-gray-500 mb-4 text-center">
          Register to enjoy fast checkout, save addresses, and track your orders.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-Enter Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-green-600 text-sm text-center">
              {successMessage}
            </div>
          )}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-[#FFA726] hover:bg-[#ff9800] text-white font-semibold py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-xs text-gray-600 text-center">
          <div className="font-semibold mb-1">Already have an account?</div>
          <div>
            <a href="/login" className="text-orange-500 hover:underline font-medium">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
