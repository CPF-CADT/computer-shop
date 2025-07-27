import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../service/api'; // Adjust the path as necessary
import { useAuth } from './context/AuthContext'; // Import useAuth to access the login function

const VerificationCode = ({ phoneNumber }) => {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  useEffect(() => {
    if (phoneNumber) {
      handleResendCode();
    } else {
      setError("Phone number not provided. Cannot send verification code.");
    }
    inputRefs.current[0]?.focus(); 
  }, [phoneNumber]);

  const handleChange = (index, value) => {
    // Only allow numeric values
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newCodes = [...codes];

    for (let i = 0; i < 4; i++) {
      newCodes[i] = pastedData[i] || '';
    }

    setCodes(newCodes);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCodes.findIndex(code => !code);
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = codes.join('');

    if (verificationCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    if (!phoneNumber) {
      setError("Phone number is missing. Cannot verify code.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiService.verifyCode(phoneNumber, verificationCode);
      console.log('Verification successful:', response);

      if (response && response.token && response.user) {
        login(response);
        navigate('/');
      } else {
        console.warn("Verification successful, but missing token/user data for automatic login.");
        navigate('/');
      }

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCodes(['', '', '', '']);
    setError('');

    if (!phoneNumber) {
      setError("Phone number is missing. Cannot resend code.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await apiService.sendVerificationCode(phoneNumber);
      console.log('Resend successful:', response);
      setError('Verification code sent! Please check your phone.');
    } catch (err) {
      console.error('Resend code error:', err);
      setError(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start p-4 pt-8 sm:pt-16">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-md flex flex-col gap-4 sm:gap-6">
        <div className="flex justify-center mb-2">
          <svg
            className="animate-pulse sm:w-12 sm:h-12"
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="#FFA726"
            />
            <circle
              cx="24"
              cy="24"
              r="16"
              fill="#FFD699"
            />
            <path
              d="M18 24l4 4 8-8"
              stroke="#FFA726"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 text-center">
          Two-Factor Authentication
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 text-center leading-relaxed">
          Enter the verification code sent to {phoneNumber || 'your phone'}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 text-center">
              Verification Code
            </label>

            <div className="flex justify-center gap-2 sm:gap-3 mb-4" onPaste={handlePaste}>
              {codes.map((code, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={code}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-lg md:text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-all duration-200"
                  required
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs sm:text-sm text-center px-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-[#FFA726] hover:bg-[#ff9800] text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:ring-opacity-50 transition duration-150 shadow hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || resendLoading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              className="text-xs sm:text-sm font-semibold text-[#FFA726] hover:underline text-center transition-colors py-2"
              disabled={loading || resendLoading}
            >
              {resendLoading ? 'Sending code...' : 'Resend Code'}
            </button>
          </div>
        </form>

        <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center">
          <div className="font-semibold mb-1">Having trouble?</div>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="text-orange-500 hover:underline font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
