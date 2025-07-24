import { useState } from 'react';
import { apiService } from '../service/api'; // Make sure this path is correct
import { useAuth } from './context/AuthContext'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginForm = () => {
    // Combined state for email or phone number
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Helper function to validate if the input is an email
    const isEmail = (input) => {
        // A simple regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (isEmail(credential)) {
                response = await apiService.staffLogin(credential, password);
            } else {
                response = await apiService.userLogin(credential, password);
            }

            console.log('Login successful:', response);

            if (response && response.token && response.user) {
                login(response); 
                toast.success('Welcome back!');
                navigate('/'); 
            } else {
                setError('Login failed: Invalid response from server.');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-start p-4 pt-16">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-6">
                <div className="flex justify-center mb-2">
                    <svg className="animate-bounce" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="12" y="20" width="24" height="18" rx="4" fill="#FFA726" />
                        <rect x="18" y="14" width="12" height="10" rx="6" fill="#FFD699" />
                        <circle cx="24" cy="29" r="2" fill="#fff" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1 text-center">
                    Welcome Back!
                </h2>
                <p className="text-xs text-gray-500 mb-4 text-center">
                    Sign in with your email (staff) or phone number (customer).
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="credential" className="block text-xs font-medium text-gray-700 mb-1">
                            Email or Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="credential"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            placeholder="Enter your email or phone number"
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
                            placeholder="Your Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm text-center font-medium p-2 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-[#FFA726] hover:bg-[#ff9800] text-white font-semibold py-2.5 px-8 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:ring-opacity-50 transition duration-150 shadow hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !credential || !password}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <a
                            href="#"
                            className="text-xs font-semibold text-[#FFA726] hover:underline text-center sm:text-right transition-colors"
                            style={{ minWidth: 120 }}
                        >
                            Forgot Your Password?
                        </a>
                    </div>
                </form>
                <div className="mt-4 text-xs text-gray-600 text-center">
                    <div className="font-semibold mb-1">Don't have an account?</div>
                    <div>
                        <a href="/register" className="text-orange-500 hover:underline font-medium">
                            Register now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;