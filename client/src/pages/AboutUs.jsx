import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#FFA726]">About Us</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Who We Are</h2>
          <p className="text-gray-700 mb-4">
            <span className="font-bold">GearTech</span> is Cambodia’s leading computer shop, specializing in custom PC builds, laptops, accessories, and expert technical support. Since our founding in 2015, we have helped thousands of customers find the perfect tech solutions for their needs.
          </p>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            To deliver high-quality products, exceptional service, and innovative solutions that empower our customers to achieve more.
          </p>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> Phnom Penh, Cambodia<br />
            <span className="font-semibold">Phone:</span> +855 12 345 678<br />
            <span className="font-semibold">Email:</span> info@geartech.com<br />
            <span className="font-semibold">Facebook:</span> fb.com/geartechshop
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
