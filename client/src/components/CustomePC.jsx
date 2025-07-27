import { Link } from 'react-router-dom';
import pcImage from '../assets/CUSTOM_PC.png'; 
const CustomPCPromo = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-6 md:flex-row md:gap-8">
        <img
        src={pcImage}
        alt="Custom PC"
        className="w-[300px] max-h-[150px] object-cover rounded-md"
        />
      <div className="mt-6 md:mt-0 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold">Build Your Dream PC</h1>
        <p className="text-sm mt-2 text-gray-300">
          Choose your parts, see live pricing, and build your rig!
        </p>

        <Link to="/build-pc">
          <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
            Customize Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CustomPCPromo;
