"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between relative z-50">
      
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 p-2 rounded-full leading-none">🍔</div>
        <h1 className="font-bold text-lg">
          HASH <span className="text-orange-500">FOOD</span>
        </h1>
      </div>

      {/* DESKTOP MENU */}
      <ul className="hidden md:flex gap-6 text-sm">
        <li className="hover:text-orange-400 cursor-pointer transition-colors">Home</li>
        <li className="hover:text-orange-400 cursor-pointer transition-colors">About</li>
        <li className="hover:text-orange-400 cursor-pointer transition-colors">Restaurants</li>
        <li className="hover:text-orange-400 cursor-pointer transition-colors">Offers</li>
        <li className="hover:text-orange-400 cursor-pointer transition-colors">Track Order</li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* LOCATION */}
        <div className="hidden md:block bg-gray-900 px-3 py-1 rounded-lg text-sm text-gray-300">
          Mwanza ▼
        </div>

        {/* LOGIN */}
        <button className="bg-orange-500 px-4 py-1 rounded-full text-sm hover:bg-orange-600 transition-colors">
          Login
        </button>

        {/* HAMBURGER / CLOSE TOGGLE */}
        <button
          className="md:hidden text-2xl w-8 h-8 flex items-center justify-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-56 bg-[#111] border border-gray-800 rounded-2xl shadow-2xl p-5 md:hidden animate-fadeIn">
          <ul className="flex flex-col gap-4 text-sm">
            <li className="hover:text-orange-400 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>Home</li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>About</li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>Restaurants</li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>Offers</li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>Track Order</li>
          </ul>
        </div>
      )}
    </nav>
  );
}