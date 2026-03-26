'use client'

import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 lg:px-12 border-t border-white/10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-['Anton'] text-6xl lg:text-8xl uppercase leading-none mb-6">
            Random <br />Answers
          </h2>
          <div className="flex gap-4 mt-8">
            <button className="bg-white text-black px-6 py-3 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors duration-300">FAQ</button>
            <button className="border border-white text-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors duration-300">Careers</button>
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-end">
          <div className="space-y-4 font-medium text-gray-400">
            <p className="text-white text-xl">Chef Gone Wild</p>
            <p>123 Culinary Ave,<br />Nairobi, Kenya</p>
            <p>hello@chefgonewild.com</p>
            <p>+254 700 000 000</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/10 text-xs font-medium text-gray-600 uppercase tracking-widest">
        <p>© 2024 Chef Gone Wild.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  )
}
