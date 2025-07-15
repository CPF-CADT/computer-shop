import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Service() {
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
          <h1 className="text-3xl font-bold text-[#FFA726]">Our Services</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">What We Offer</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Custom PC Building & Consultation</li>
            <li>On-site and Remote Technical Support</li>
            <li>Warranty & Repair Services (up to 3 years)</li>
            <li>Software Installation & Troubleshooting</li>
            <li>Networking Setup & Security</li>
            <li>Accessories & Upgrades</li>
          </ul>
          <div className="mt-6">
            <h3 className="font-bold text-lg text-[#FFA726] mb-2">Why Choose GearTech?</h3>
            <p className="text-gray-700">
              <span className="font-semibold">Expert Technicians:</span> Our team is certified and experienced.<br />
              <span className="font-semibold">Fast Turnaround:</span> Most repairs completed within 24 hours.<br />
              <span className="font-semibold">Customer Care:</span> Dedicated support for every customer.<br />
              <span className="font-semibold">Flexible Service:</span> Book online, by phone, or in-store.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
