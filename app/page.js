'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartModal from '../components/CartModal'
import CheckoutModal from '../components/CheckoutModal'
import SuccessModal from '../components/SuccessModal'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Slideshow auto-advance
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 4000)
    
    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons()
    }
  }, [currentSlide])

  // Scroll animation observer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-enter-active')
            observer.unobserve(entry.target)
          }
        })
      }, observerOptions)

      document.querySelectorAll('.scroll-trigger').forEach(el => {
        observer.observe(el)
      })

      return () => observer.disconnect()
    }
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] text-lg antialiased overflow-x-hidden selection:bg-rose-500 selection:text-white">
      <div className="bg-noise"></div>
      <Navbar />

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE: Typography & Navigation */}
        <div className="relative pt-24 pb-12 px-6 lg:px-12 flex flex-col justify-between border-r border-white/10 z-10 bg-[#0a0a0a]">
          <div className="space-y-2">
            {/* Navigation Items */}
            <Link href="/menu" className="group border-b border-white/20 py-8 block overflow-hidden">
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-all duration-500 leading-[0.9] group-hover:translate-x-4">
                  Our Menu
                </h1>
                <i data-lucide="arrow-up-right" className="w-8 h-8 lg:w-12 lg:h-12 text-white/20 group-hover:text-rose-500 transition-all duration-500 group-hover:rotate-45"></i>
              </div>
            </Link>

            <Link href="/crafts" className="group border-b border-white/20 py-8 block overflow-hidden">
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-all duration-500 leading-[0.9] group-hover:translate-x-4">
                  Crafts
                </h1>
                <i data-lucide="arrow-up-right" className="w-8 h-8 lg:w-12 lg:h-12 text-white/20 group-hover:text-rose-500 transition-all duration-500 group-hover:rotate-45"></i>
              </div>
            </Link>

            <Link href="/events" className="group border-b border-white/20 py-8 block overflow-hidden">
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-all duration-500 leading-[0.9] group-hover:translate-x-4">
                  Events
                </h1>
                <i data-lucide="arrow-up-right" className="w-8 h-8 lg:w-12 lg:h-12 text-white/20 group-hover:text-rose-500 transition-all duration-500 group-hover:rotate-45"></i>
              </div>
            </Link>

            <Link href="/about-us" className="group border-b border-white/20 py-8 block overflow-hidden">
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-all duration-500 leading-[0.9] group-hover:translate-x-4">
                  About Us
                </h1>
                <i data-lucide="arrow-up-right" className="w-8 h-8 lg:w-12 lg:h-12 text-white/20 group-hover:text-rose-500 transition-all duration-500 group-hover:rotate-45"></i>
              </div>
            </Link>
          </div>

          {/* Footer of Left Side */}
          <div className="mt-12 lg:mt-24">
            <Link 
              href="/menu"
              className="inline-flex items-center justify-between w-full bg-white text-black py-6 px-8 font-['Anton'] text-3xl uppercase tracking-wide hover:bg-rose-500 hover:text-white transition-all duration-500 group rounded-sm shadow-2xl"
            >
              <span>Book A Table Now</span>
              <i data-lucide="arrow-right" className="group-hover:translate-x-4 transition-transform duration-500 w-8 h-8"></i>
            </Link>

            <div className="flex justify-between items-end mt-12 text-sm font-medium text-gray-500">
              <div className="flex flex-col gap-1">
                <span className="text-white mb-2 font-bold uppercase tracking-widest text-xs">Locations</span>
                <a href="#" className="hover:text-rose-500 transition-colors">Downtown Nairobi</a>
                <a href="#" className="hover:text-rose-500 transition-colors">Westlands Hub</a>
              </div>
              <div className="flex gap-4">
                <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-white/10 hover:border-white shadow-lg shadow-black/50"><i data-lucide="instagram" className="w-5 h-5"></i></a>
                <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-white/10 hover:border-white shadow-lg shadow-black/50"><i data-lucide="facebook" className="w-5 h-5"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Visual Slideshow */}
        <div className="relative h-[60vh] lg:h-auto overflow-hidden bg-gray-900 border-l border-white/10">
          {/* Slideshow Images */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/assets/food-1.jpg" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-all duration-1000 transform scale-100 ${currentSlide === 0 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
              alt="Food"
            />
            <img 
              src="/assets/food-2.jpg" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-all duration-1000 transform scale-100 ${currentSlide === 1 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
              alt="Food"
            />
            <img 
              src="/assets/food-3.jpg" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-all duration-1000 transform scale-100 ${currentSlide === 2 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
              alt="Food"
            />
          </div>

          {/* Overlay Text on Image */}
          <div className="absolute top-1/2 left-6 lg:left-12 transform -translate-y-1/2 z-20 pointer-events-none mix-blend-overlay opacity-80">
            <h2 className="font-['Anton'] text-[10rem] lg:text-[14rem] leading-none text-white tracking-tighter opacity-30 select-none">
              TASTE
            </h2>
          </div>

          <div className="absolute bottom-12 right-12 z-30">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-mono border border-white/20 text-white shadow-2xl">
              <span className="opacity-50">SCENE</span> <span className="text-rose-500 font-bold">0{currentSlide + 1} / 03</span>
            </div>
          </div>
        </div>
      </main>

      {/* Highlights Section */}
      <section className="relative bg-[#f4f4f0] text-black py-32 border-t border-black">
        <div className="px-6 lg:px-12 mb-24 flex items-end justify-between fade-enter scroll-trigger">
          <div className="max-w-4xl">
            <p className="font-mono text-sm mb-4 text-rose-600 uppercase tracking-[0.3em] font-bold">The Gastronomic Experience</p>
            <h2 className="font-['Anton'] text-7xl lg:text-[9rem] uppercase tracking-tight leading-[0.85] text-black">
              Born from <br />Fire & Craft
            </h2>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center animate-spin-slow">
              <i data-lucide="star" className="w-12 h-12 text-black"></i>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-6 lg:px-12">
           <Link href="/menu" className="group relative aspect-square bg-black overflow-hidden border border-black/10">
              <img 
                src="/assets/food-1.jpg" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                alt="Menu"
              />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-['Anton'] text-5xl text-white uppercase leading-none">Our Menu</h3>
                <p className="text-white/60 font-medium uppercase tracking-widest text-xs mt-2">Explore Flavors</p>
              </div>
           </Link>
           <Link href="/crafts" className="group relative aspect-square bg-black overflow-hidden border border-black/10">
              <img 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                alt="Crafts"
              />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-['Anton'] text-5xl text-white uppercase leading-none">Crafts</h3>
                <p className="text-white/60 font-medium uppercase tracking-widest text-xs mt-2">Local Artistry</p>
              </div>
           </Link>
           <Link href="/events" className="group relative aspect-square bg-black overflow-hidden border border-black/10">
              <img 
                src="https://images.unsplash.com/photo-1550966842-30cae010dd4e?w=800" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                alt="Events"
              />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-['Anton'] text-5xl text-white uppercase leading-none">Events</h3>
                <p className="text-white/60 font-medium uppercase tracking-widest text-xs mt-2">Join the Scene</p>
              </div>
           </Link>
        </div>
      </section>

      <Footer />
      <CartModal />
      <CheckoutModal />
      <SuccessModal />
    </div>
  )
}
