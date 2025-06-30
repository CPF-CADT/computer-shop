import { useState } from 'react';
import mainLogo from "../assets/gear-tech.png";


const RegisterForm = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Register attempt with:', { name, email, password });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 self-start ml-[5%] md:ml-[10%] lg:ml-[15%] xl:ml-[calc(50%-32rem)]">
        Register
      </h1>

      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row relative">

        <div className="absolute left-0 top-0 bottom-[calc(100%-29rem)] md:bottom-0 w-1.5 bg-[#FFA726]  rounded-l-lg md:hidden"></div>
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFA726]  rounded-l-lg"></div>

       
        <div className="w-full md:w-1/2 md:pr-10 relative pl-6 md:pl-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Register
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            If you have an account, sign in with your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
     
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                required
              />
            </div>

       
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email" 
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
                placeholder="Create Password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-auto bg-[#FFA726] hover:cursor-pointer text-white font-semibold py-2.5 px-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center mt-10 md:mt-0 md:pl-10">
          <div className="text-6xl lg:text-7xl font-bold text-gray-800 mb-8">
            <img src={mainLogo} alt="" />
          </div>
          <div className="text-left w-full max-w-xs">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Creating an account has many benefits:
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
              <li>Check out faster</li>
              <li>Keep more than one address</li>
              <li>Track orders and more</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;