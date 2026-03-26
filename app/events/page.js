'use client'

import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartModal from '../../components/CartModal'
import CheckoutModal from '../../components/CheckoutModal'
import SuccessModal from '../../components/SuccessModal'

export default function EventsPage() {
  const events = [
    {
      title: 'Chef\'s Table',
      date: 'Every Thursday',
      description: 'A 7-course tasting menu curated by Chef Gone Wild.',
      image: 'https://images.unsplash.com/photo-1550966842-30cae010dd4e?w=800'
    },
    {
      title: 'Live Jazz Night',
      date: 'Every Friday',
      description: 'The best local jazz musicians in the city.',
      image: 'https://images.unsplash.com/photo-1514525253344-991422a7e2c5?w=800'
    },
    {
      title: 'Mixology Workshop',
      date: 'Saturdays @ 2PM',
      description: 'Learn the art of crafting our signature cocktails.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'
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
              Events
            </h1>
            <p className="text-gray-400 text-2xl max-w-3xl leading-relaxed">
              Experience more than just a meal. Join us for a curated series of events designed to inspire, connect, and celebrate.
            </p>
          </div>

          <div className="space-y-32">
            {events.map((event, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-xl bg-white/5 border border-white/10 group">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <span className="bg-rose-500 text-white px-4 py-1 text-xs font-bold uppercase mb-4 inline-block">{event.date}</span>
                  <h2 className="font-['Anton'] text-6xl uppercase tracking-tight text-white mb-6 leading-none">{event.title}</h2>
                  <p className="text-gray-400 text-xl leading-relaxed mb-12">{event.description}</p>
                  <button className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 font-bold uppercase text-lg group hover:bg-rose-500 hover:text-white transition-colors">
                    Reserve Now
                    <i data-lucide="arrow-right" className="w-6 h-6 group-hover:translate-x-2 transition-transform"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-48 text-center bg-[#111] p-24 border border-white/10 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
            <h2 className="font-['Anton'] text-6xl lg:text-8xl uppercase leading-none mb-8 text-white relative z-10">Private <br />Bookings</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 relative z-10">Book our full space or a private table for your next milestone celebration. We\'ll handle every detail to ensure an unforgettable experience.</p>
            <button className="bg-white text-black px-12 py-5 font-bold uppercase text-lg hover:bg-rose-500 hover:text-white transition-colors relative z-10">Contact Event Coordinator</button>
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
