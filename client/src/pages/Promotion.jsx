import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { MdLocalOffer, MdStar, MdCardGiftcard, MdSchool, MdGroup } from "react-icons/md";

export default function Promotion() {
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
          <MdLocalOffer className="text-4xl text-orange-400 drop-shadow" />
          <h1 className="text-4xl font-extrabold text-orange-500 drop-shadow">Promotions & Deals</h1>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-orange-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Promotions</h2>
          <ul className="list-none ml-0 text-gray-700 space-y-4">
            <li className="flex items-center gap-2">
              <MdStar className="text-orange-400" />
              <span>
                <span className="font-bold text-orange-500">Summer Sale:</span> Up to 30% off select laptops and desktops.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdCardGiftcard className="text-orange-400" />
              <span>
                <span className="font-bold text-orange-500">Accessory Bundle:</span> Free mouse & keyboard with every PC purchase.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdSchool className="text-orange-400" />
              <span>
                <span className="font-bold text-orange-500">Student Discount:</span> 10% off for students with valid ID.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdGroup className="text-orange-400" />
              <span>
                <span className="font-bold text-orange-500">Referral Rewards:</span> Earn $50 store credit for every friend you refer.
              </span>
            </li>
          </ul>
          <div className="mt-8">
            <h3 className="font-bold text-lg text-orange-500 mb-2">How to Redeem</h3>
            <p className="text-gray-700">
              Visit our store or shop online. Promotions are automatically applied at checkout. For student and referral rewards, please contact our support team.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
