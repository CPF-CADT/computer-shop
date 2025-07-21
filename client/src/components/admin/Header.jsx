import React from "react";
import { AiOutlineSearch, AiOutlineBell, AiOutlineSetting, AiOutlineDown } from "react-icons/ai";

export default function Header() {
  const user = {
    name: "Estiaq Noor",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };

  return (
    <header className="w-full h-16 flex items-center bg-white shadow-sm px-6 sticky top-0 z-20">
      <div className="flex items-center flex-1 max-w-lg bg-gray-100 rounded-lg px-3 py-2 mr-4">
        <AiOutlineSearch className="text-xl text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search product..."
          className="bg-transparent outline-none flex-1 text-gray-700"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-purple-100">
          <AiOutlineBell className="text-xl text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-purple-100">
          <AiOutlineSetting className="text-xl text-gray-500" />
        </button>
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 cursor-pointer hover:bg-purple-100">
          <img
            src={user.avatar}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <span className="font-medium text-gray-700 mr-1 hidden sm:block">{user.name}</span>
          <AiOutlineDown className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}