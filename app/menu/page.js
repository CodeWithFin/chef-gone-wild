'use client'

import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartModal from '../../components/CartModal'
import CheckoutModal from '../../components/CheckoutModal'
import SuccessModal from '../../components/SuccessModal'
import { useCart } from '../../components/CartContext'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      const items = await response.json()
      setMenuItems(items)
      const uniqueCategories = [...new Set(items.map(item => item.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading menu:', error)
    }
  }

  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] text-lg antialiased min-h-screen">
      <div className="bg-noise"></div>
      <Navbar />

      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="font-['Anton'] text-7xl lg:text-9xl text-white uppercase tracking-tight leading-none mb-4">
              Our Menu
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl">
              Explore our curated selection of seasonal dishes and handcrafted cocktails.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-white/10 pb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 ${!selectedCategory ? 'bg-rose-500 border-rose-500 text-white' : 'border-white/20 hover:border-white'}`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${selectedCategory === category ? 'bg-rose-500 border-rose-500 text-white' : 'border-white/20 hover:border-white'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems
              .filter(item => !selectedCategory || item.category === selectedCategory)
              .map(item => (
                <div 
                  key={item.id} 
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-rose-500 transition-colors group flex flex-col"
                >
                  <div className="aspect-[4/3] bg-black overflow-hidden relative">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/400x300'}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 uppercase">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-['Anton'] text-2xl uppercase tracking-tight mb-2 text-white">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 flex-1">{item.description || ''}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-2xl text-white">KSh {item.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors font-bold uppercase text-xs tracking-widest"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
