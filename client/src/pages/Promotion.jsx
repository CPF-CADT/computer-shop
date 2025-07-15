import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Promotion() {
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
          <h1 className="text-3xl font-bold text-[#FFA726]">Promotions & Deals</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Promotions</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><span className="font-bold text-[#FFA726]">Summer Sale:</span> Up to 30% off select laptops and desktops.</li>
            <li><span className="font-bold text-[#FFA726]">Accessory Bundle:</span> Free mouse & keyboard with every PC purchase.</li>
            <li><span className="font-bold text-[#FFA726]">Student Discount:</span> 10% off for students with valid ID.</li>
            <li><span className="font-bold text-[#FFA726]">Referral Rewards:</span> Earn $50 store credit for every friend you refer.</li>
          </ul>
          <div className="mt-6">
            <h3 className="font-bold text-lg text-[#FFA726] mb-2">How to Redeem</h3>
            <p className="text-gray-700">
              Visit our store or shop online. Promotions are automatically applied at checkout. For student and referral rewards, please contact our support team.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
