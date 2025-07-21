import PC1 from '../../assets/RTX3080.png';

export default function BannerGPU() {
  return (
    

    <div className="w-full bg-[#12092B] rounded-md flex items-center justify-between px-8 py-6 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Exclusive Offer</h2>
        <div className="flex items-center mb-2">
          <span className="w-6 h-6 rounded-full bg-orange-400 mr-3 inline-block"></span>
          <span className="text-white font-semibold">Get Now!!</span>
        </div>
        <div className="text-3xl font-bold text-white leading-tight">
          Get Your High <span className="text-orange-400">Graphic Card</span><br />
          at Bro BuffetNak168smosSne
        </div>
        <button className="mt-6 px-6 py-2 bg-orange-400 text-white rounded-md font-semibold shadow hover:bg-orange-500 transition">
          Shop Now
        </button>
      </div>
      <img src={PC1} alt="Graphic Card Banner" className="h-40 object-contain ml-8" />
    </div>
  );
}