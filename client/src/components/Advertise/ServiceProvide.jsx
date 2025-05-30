import { RiCustomerServiceFill } from "react-icons/ri";

export default function ServiceProvide() {
  return (
    <div className="bg-[#2C2C2C] py-12">
      <div className="max-w-6xl mx-auto flex justify-around text-center text-white">
        {/* Product Support */}
        <div className="flex flex-col items-center max-w-xs">
          <div className="bg-[#FFA726] p-4 rounded-full mb-4">
            <RiCustomerServiceFill size={32} />
          </div>
          <h2 className="font-semibold text-white mb-2">Product Support</h2>
          <p className="text-sm text-gray-300">
            Up to 3 years on-site warranty available for your peace of mind.
          </p>
        </div>

        {/* Personal Account */}
        <div className="flex flex-col items-center max-w-xs">
          <div className="bg-[#FFA726] p-4 rounded-full mb-4">
            <RiCustomerServiceFill size={32} />
          </div>
          <h2 className="font-semibold text-white mb-2">Personal Account</h2>
          <p className="text-sm text-gray-300">
            With big discounts, free delivery and a dedicated support specialist.
          </p>
        </div>

        {/* Amazing Savings */}
        <div className="flex flex-col items-center max-w-xs">
          <div className="bg-[#FFA726] p-4 rounded-full mb-4">
            <RiCustomerServiceFill size={32} />
          </div>
          <h2 className="font-semibold text-white mb-2">Amazing Savings</h2>
          <p className="text-sm text-gray-300">
            Up to 70% off new Products, you can be sure of the best price.
          </p>
        </div>
      </div>
    </div>
  );
}
