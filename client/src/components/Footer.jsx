import mainLogo from "../assets/gear-tech.png";

export default function Footer() {
  return (
    <footer className="bg-[#FFA726] py-6 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={mainLogo} alt="Logo" className="w-10 h-10 rounded" />
          <span className="font-bold text-xl text-white">GearTech Computer Shop</span>
        </div>
        <div className="text-white text-sm mt-2 md:mt-0">
          &copy; {new Date().getFullYear()} GearTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
