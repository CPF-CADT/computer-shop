import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Service() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-white to-white">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-base font-semibold shadow transition"
        >
          &larr; Back
        </button>
        <h1 className="text-4xl font-extrabold text-[#FFA726] tracking-tight drop-shadow mb-10">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Box 1: PC Building & Consultation */}
          <div className="bg-white rounded-2xl shadow-xl border-l-8 border-[#FFA726] p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Custom PC Building & Consultation
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 text-base">
              <li>Expert advice for selecting components</li>
              <li>Personalized builds for gaming, work, or study</li>
              <li>Compatibility checks and performance optimization</li>
              <li>Assembly and cable management included</li>
            </ul>
          </div>
          {/* Box 2: Technical Support & Repairs */}
          <div className="bg-white rounded-2xl shadow-xl border-l-8 border-[#FFA726] p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Technical Support & Repairs
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 text-base">
              <li>On-site and remote troubleshooting</li>
              <li>Warranty & repair services (up to 3 years)</li>
              <li>Software installation & virus removal</li>
              <li>Networking setup & security solutions</li>
            </ul>
          </div>
          {/* Box 3: Accessories, Upgrades & Customer Care */}
          <div className="bg-white rounded-2xl shadow-xl border-l-8 border-[#FFA726] p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Accessories, Upgrades & Customer Care
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 text-base">
              <li>Wide selection of accessories & upgrades</li>
              <li>Exclusive deals and bundle offers</li>
              <li>Dedicated support for every customer</li>
              <li>Flexible booking: online, phone, or in-store</li>
            </ul>
          </div>
        </div>
        {/* Why Choose GearTech Section */}
        <div className="mt-12">
          <h3 className="font-extrabold text-xl text-[#FFA726] mb-3">
            Why Choose GearTech?
          </h3>
          <div className="text-gray-700 text-base leading-relaxed space-y-2">
            <div>
              <span className="font-bold text-gray-900">
                Expert Technicians:
              </span>{" "}
              Our team is certified and experienced.
            </div>
            <div>
              <span className="font-bold text-gray-900">Fast Turnaround:</span>{" "}
              Most repairs completed within 24 hours.
            </div>
            <div>
              <span className="font-bold text-gray-900">Customer Care:</span>{" "}
              Dedicated support for every customer.
            </div>
            <div>
              <span className="font-bold text-gray-900">Flexible Service:</span>{" "}
              Book online, by phone, or in-store.
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}
