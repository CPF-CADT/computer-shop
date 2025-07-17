import { useState } from 'react';
import mainLogo from "../assets/gear-tech.png";


const RegisterForm = () => {
  const [name, setName] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Register attempt with:', { name, phone, password });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 self-start ml-2 sm:ml-8">
        Register
      </h1>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-6 relative">
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
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-[#FFA726] hover:bg-[#ff9800] text-white font-semibold py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-xs text-gray-600 text-center">
          <div className="font-semibold mb-1">Why create an account?</div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;