import { useState } from 'react';
import mainLogo from "../assets/gear-tech.png";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
    alert(`Login attempt with Email: ${email}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 self-start ml-[5%] md:ml-[10%] lg:ml-[15%] xl:ml-[calc(50%-32rem)]">
        Login
      </h1>

      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row relative">
        {/* Orange decorative line - visible for the form section */}
        <div className="absolute left-0 top-0 bottom-[calc(100%-theme(space.72))] md:bottom-0 w-1.5 bg-[#FFA726]  rounded-l-lg md:hidden"></div>
         <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFA726] rounded-l-lg"></div>


        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 md:pr-10 relative pl-6 md:pl-10"> {/* Added pl-6 for mobile, pl-10 for md to make space for the line */}
          
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Hello, Registered Customer, Wellcome back!
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            If you have a registered account, sign in with your email address or phone number.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email / Phone Number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FFA726] hover:cursor-pointer text-white font-semibold py-2.5 px-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150"
              >
                Sign In
              </button>
              <a
                href="#"
                className="text-xs text-orange-500 hover:underline text-center sm:text-right"
              >
                Forgot Your Password?
              </a>
            </div>
          </form>
        </div>

        {/* Right Side: Logo */}
        <div className="w-full md:w-1/2 flex items-center justify-center mt-10 md:mt-0 md:pl-10">
          <img src={mainLogo} alt="" />
        </div>
      </div>

      <p className="mt-10 text-lg font-semibold text-gray-800 self-start ml-[5%] md:ml-[10%] lg:ml-[15%] xl:ml-[calc(50%-32rem)]">
        New Customer?
      </p>
    </div>
  );
};

export default LoginForm;