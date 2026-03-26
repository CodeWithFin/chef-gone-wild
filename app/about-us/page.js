'use client'

import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartModal from '../../components/CartModal'
import CheckoutModal from '../../components/CheckoutModal'
import SuccessModal from '../../components/SuccessModal'

export default function AboutUsPage() {
  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] text-lg antialiased min-h-screen">
      <div className="bg-noise"></div>
      <Navbar />

      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h1 className="font-['Anton'] text-7xl lg:text-[10rem] text-white uppercase tracking-tight leading-none mb-8">
              About Us
            </h1>
            <p className="text-gray-400 text-2xl max-w-3xl leading-relaxed mb-12">
              Born from a passion for fire and flavor. Chef Gone Wild is more than a restaurant—it\'s a movement focused on bringing people together through exceptional food and artisan craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-32">
            <div className="space-y-12">
              <div className="bg-[#f0eadd] text-black p-12 rounded-sm transform hover:-translate-y-2 transition-transform duration-500 min-h-[400px] flex flex-col justify-between group">
                <div>
                  <span className="bg-black text-white px-4 py-1 text-sm font-bold uppercase mb-6 inline-block">Philosophy</span>
                  <h3 className="font-['Anton'] text-6xl leading-none uppercase tracking-tight mb-8">Farm to Glass</h3>
                  <p className="text-xl font-medium leading-relaxed opacity-80">We believe in the power of local. From the organic herbs in our cocktails to the hand-reared meats on our grill, every ingredient has a story to tell.</p>
                </div>
                <div className="flex justify-between items-center pt-12 border-t border-black/10 group-hover:border-black transition-colors">
                  <span className="font-bold uppercase tracking-widest text-sm">Read Our Story</span>
                  <i data-lucide="arrow-right" className="w-6 h-6 group-hover:translate-x-2 transition-transform"></i>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-white/10 text-white p-12 rounded-sm transform hover:-translate-y-2 transition-transform duration-500 min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                  <i data-lucide="wine" className="w-64 h-64"></i>
                </div>
                <div className="relative z-10">
                  <span className="bg-rose-500 text-white px-4 py-1 text-sm font-bold uppercase mb-6 inline-block">Special Edition</span>
                  <h3 className="font-['Anton'] text-6xl leading-none uppercase tracking-tight mb-8">Summer Mix</h3>
                  <p className="text-xl font-medium leading-relaxed text-gray-400 max-w-md">Our 2024 cocktail roster is a celebration of seasonal botanicals and artisan spirits. Handcrafted daily for the modern palate.</p>
                </div>
                <div className="relative z-10 flex justify-between items-center pt-12 border-t border-white/10 group-hover:border-rose-500 transition-colors">
                  <span className="font-bold uppercase tracking-widest text-sm text-gray-400 group-hover:text-rose-500">Explore Mixology</span>
                  <i data-lucide="arrow-right" className="w-6 h-6 group-hover:translate-x-2 transition-transform group-hover:text-rose-500"></i>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-40 space-y-12">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800" 
                    alt="Chef at work" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="p-12 border-l-4 border-rose-500 bg-white/5">
                  <blockquote className="font-['Anton'] text-4xl uppercase leading-tight text-white mb-8 italic">
                    "Food is the most primal form of connection. When we cook with fire and craft, we honor our heritage while creating new memories."
                  </blockquote>
                  <cite className="font-bold text-rose-500 uppercase tracking-widest">— Chef & Founder</cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartModal />
      <CheckoutModal />
      <SuccessModal />
    </div>
  )
}
