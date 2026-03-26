'use client'

import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartModal from '../../components/CartModal'
import CheckoutModal from '../../components/CheckoutModal'
import SuccessModal from '../../components/SuccessModal'

export default function CraftsPage() {
  const crafts = [
    {
      title: 'Artisan Pottery',
      description: 'Hand-thrown ceramics used for our signature dishes.',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800'
    },
    {
      title: 'Woven Textiles',
      description: 'Locally crafted table linens and decorative elements.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800'
    },
    {
      title: 'Custom Woodwork',
      description: 'Our tables and bar are crafted from reclaimed African mahogany.',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'
    }
  ]

  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] text-lg antialiased min-h-screen">
      <div className="bg-noise"></div>
      <Navbar />

      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h1 className="font-['Anton'] text-7xl lg:text-[10rem] text-white uppercase tracking-tight leading-none mb-8">
              Crafts
            </h1>
            <p className="text-gray-400 text-2xl max-w-3xl leading-relaxed">
              At Chef Gone Wild, our commitment to craft extends beyond the kitchen. We partner with local artisans to create the unique atmosphere and tools that define our dining experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {crafts.map((craft, i) => (
              <div key={i} className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-500">
                <div className="aspect-[4/5] overflow-hidden rounded-lg mb-6">
                  <img 
                    src={craft.image} 
                    alt={craft.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-['Anton'] text-4xl uppercase mb-3 text-white">{craft.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{craft.description}</p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center group-hover:border-rose-500 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-rose-500">Learn More</span>
                  <i data-lucide="arrow-right" className="w-5 h-5 group-hover:translate-x-2 transition-transform group-hover:text-rose-500"></i>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 bg-white text-black flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
            <div className="max-w-xl">
              <h2 className="font-['Anton'] text-5xl uppercase leading-none mb-4">Are you an artisan?</h2>
              <p className="font-medium text-lg leading-snug">We are always looking for local partners to showcase their work in our space. Let's create something beautiful together.</p>
            </div>
            <button className="bg-rose-500 text-white px-12 py-5 font-bold uppercase text-lg hover:bg-black transition-colors shrink-0">Get In Touch</button>
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
