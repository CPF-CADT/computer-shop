import React from "react";
import mainLogo from "../assets/tech-gear-w.png";
import abaLogo from "../assets/Logo/aba-payway-woocommerce-payment-gateway-1.jpeg";
import partner2Logo from "../assets/Logo/telegram.png";
import khqrLogo from "../assets/Logo/khqr-5.png";

export default function Footer() {
  return (
    <footer className="bg-[#FFA726] relative overflow-hidden border-t border-black">
   
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-10">
       
        <div className="flex flex-col items-center">
          <img
            src={mainLogo}
            alt="GearTech Logo"
            className="h-32 w-auto object-contain mx-auto"
            style={{ maxWidth: 500 }}
          />
          <span className="mt-4 font-bold text-xl text-black tracking-tight text-center">
            GearTech Computer Shop
          </span>
          <p className="text-black text-sm mt-2 leading-relaxed text-center max-w-xl">
            Your trusted destination for computers, peripherals, and IT solutions
            in Phnom Penh. We provide quality products, expert advice, and
            friendly service for all your tech needs.
          </p>
        </div>
     
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start max-w-4xl mx-auto">
          
          <div className="col-span-2 flex flex-col md:flex-row gap-10 items-start justify-center">
            {/* On mobile, center the Company section */}
            <div className="flex flex-col items-center w-full md:items-center flex-1">
              <h3 className="font-bold text-black mb-3 text-base uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about-us"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/service"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Service
                  </a>
                </li>
                <li>
                  <a
                    href="/promotion"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Promotion
                  </a>
                </li>
                <li>
                  <a
                    href="/peripherals"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Peripherals
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-center flex-1">
              <h3 className="font-bold text-black mb-3 text-base uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-black text-center">
                <li>
                  <span className="font-semibold">Address:</span> Toul Slvng,
                  Street NoLLGB, Phnom Penh, Rathanak Home, street RathanakCafe
                </li>
                <li>
                  <span className="font-semibold">Phone:</span>{" "}
                  <a
                    href="tel:+855092697056"
                    className="hover:text-white"
                  >
                    (+855) 0 92 697 056
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:info@geartech.com"
                    className="hover:text-white"
                  >
                    info@geartech.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
         
          <div className="flex flex-col items-center md:items-center">
            <h3 className="font-bold text-black mb-3 text-base uppercase tracking-wider">
              Support By
            </h3>
            <div className="flex gap-3">
              <img
                src={abaLogo}
                alt="PayPal"
                className="h-10 w-auto bg-white rounded shadow p-1"
              />
              <img
                src={partner2Logo}
                alt="Partner 2"
                className="h-10 w-auto bg-white rounded shadow p-1"
              />
              <img
                src={khqrLogo}
                alt="KHQR"
                className="h-10 w-auto bg-white rounded shadow p-1"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-black flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-black text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} GearTech Computer Shop. All rights
            reserved.
          </div>
          <div className="flex gap-4 justify-center md:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 text-black hover:text-white transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"></path>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5 text-black hover:text-white transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.414 3.678 1.395 2.697 2.376 2.414 3.488 2.355 4.769.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.281.342 2.393 1.323 3.374.981.981 2.093 1.264 3.374 1.323C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.342 3.374-1.323.981-.981 1.264-2.093 1.323-3.374.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.281-.342-2.393-1.323-3.374-.981-.981-2.093-1.264-3.374-1.323C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path>
              </svg>
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <svg
                className="w-5 h-5 text-black hover:text-white transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.707 7.293l-1.414 1.414-7.293 7.293-1.414-1.414 7.293-7.293 1.414 1.414zm-2.121 2.121l-7.293 7.293-1.414-1.414 7.293-7.293 1.414 1.414z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}