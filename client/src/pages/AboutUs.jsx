import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-100 via-white to-orange-200">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-orange-100 rounded-full hover:bg-orange-200 text-sm font-semibold shadow transition"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-extrabold text-orange-500 drop-shadow">About Us</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-orange-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Who We Are</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            <span className="font-bold text-orange-500">GearTech</span> is Cambodia’s leading computer shop, specializing in custom PC builds, laptops, accessories, and expert technical support. Since our founding in 2015, we have helped thousands of customers find the perfect tech solutions for their needs.
          </p>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            To deliver high-quality products, exceptional service, and innovative solutions that empower our customers to achieve more.
          </p>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <div className="bg-orange-50 rounded-lg p-6 mb-2 border border-orange-100">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-orange-500">Location:</span> Phnom Penh, Cambodia
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-orange-500">Phone:</span> +855 12 345 678
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-orange-500">Email:</span> info@geartech.com
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-orange-500">Facebook:</span> fb.com/geartechshop
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
