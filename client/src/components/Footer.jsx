import React from "react";
import mainLogo from "../assets/tech-gear-w.png";

export default function Footer() {
  return (
    <footer className="bg-[#FFA726]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start text-center md:text-left">
          {/* Brand/About */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={mainLogo}
              alt="GearTech Logo"
              className="h-20 w-auto mb-3"
              style={{ maxWidth: 240 }}
            />
            <h2 className="font-semibold text-2xl text-white mb-2">
              GearTech Computer Shop
            </h2>
            <span className="text-white font-normal text-base mb-2">
              Your trusted destination for computers, peripherals, and IT solutions
              in Phnom Penh.
            </span>
            <p className="text-white text-sm font-normal mb-6">
              We provide quality products, expert advice, and friendly service for
              all your tech needs.
            </p>
          </div>
          {/* Services */}
          <div className="flex flex-col items-center md:items-start justify-center h-full pt-14">
            <h3 className="font-semibold text-white mb-3 text-base uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-white font-normal">
              <li>Planning</li>
              <li>Consulting</li>
              <li>Analysis</li>
              <li>User Training</li>
            </ul>
          </div>
          {/* Company */}
          <div className="flex flex-col items-center md:items-start justify-center h-full pt-14">
            <h3 className="font-semibold text-white mb-3 text-base uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-white font-normal">
              <li>
                <a href="/about-us" className="hover:text-[#232F3E] transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/service" className="hover:text-[#232F3E] transition-colors duration-200">
                  Service
                </a>
              </li>
              <li>
                <a href="/promotion" className="hover:text-[#232F3E] transition-colors duration-200">
                  Promotion
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#232F3E] transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              
            </ul>
          </div>
          {/* Contact & Social */}
          <div className="flex flex-col items-center md:items-start justify-center h-full pt-14">
            <h3 className="font-semibold text-white mb-3 text-base uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-white font-normal mb-3">
              <li>
                <span className="font-semibold">Call:</span>{" "}
                <a href="tel:+855092697056" className="hover:text-[#232F3E]">
                  (+855) 0 92 697 056
                </a>
              </li>
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:info@geartech.com" className="hover:text-[#232F3E]">
                  info@geartech.com
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mb-2 justify-center">
              <a
                href="https://www.facebook.com/imsivv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6 text-[#232F3E] hover:text-white transition"
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
                  className="w-6 h-6 text-[#232F3E] hover:text-white transition"
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
                  className="w-6 h-6 text-[#232F3E] hover:text-white transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.707 7.293l-1.414 1.414-7.293 7.293-1.414-1.414 7.293-7.293 1.414 1.414zm-2.121 2.121l-7.293 7.293-1.414-1.414 7.293-7.293 1.414 1.414z"></path>
                </svg>
              </a>
            </div>
            <span className="font-semibold text-white text-sm mt-2">Follow Us</span>
          </div>
        </div>
        <div className="text-xs text-white text-center mt-8 font-normal">
          &copy; {new Date().getFullYear()} GearTech Computer Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}