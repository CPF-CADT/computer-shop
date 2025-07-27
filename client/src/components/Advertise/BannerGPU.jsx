import PC1 from '../../assets/RTX3080.png';

export default function BannerGPU() {
  return (
    <div
      className="
        w-full bg-[#12092B] rounded-md flex 
        flex-col md:flex-row                  
        items-center                         
        justify-between 
        text-center md:text-left             
        px-4 sm:px-8 py-6 mb-8              
      "
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Exclusive Offer</h2>
        <div className="flex items-center justify-center md:justify-start mb-2">
          <span className="w-6 h-6 rounded-full bg-orange-400 mr-3 inline-block"></span>
          <span className="text-white font-semibold">Get Now!!</span>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-white leading-tight">
          Get Your High <span className="text-orange-400">Graphic Card</span>
          <br />
          at Bro BuffetNak168smosSne
        </div>
        <button className="mt-6 px-6 py-2 bg-orange-400 text-white rounded-md font-semibold shadow hover:bg-orange-500 transition">
          Shop Now
        </button>
      </div>

      {/* Image Section */}
      <img
        src={PC1}
        alt="Graphic Card Banner"
        className="
          h-32 md:h-40 object-contain        
          mt-6 md:mt-0 md:ml-8
        "
      />
    </div>
  );
}