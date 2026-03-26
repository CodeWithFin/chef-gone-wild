'use client'

import Link from 'next/link'
import { useCart } from './CartContext'

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()

  return (
    <header className="fixed top-0 w-full z-40 mix-blend-difference text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="relative w-8 h-8 border border-white/30 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
          <i data-lucide="chef-hat" className="w-4 h-4"></i>
        </div>
        <span className="font-bold tracking-tight uppercase text-sm">Chef Gone Wild</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/track" className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300">
          <i data-lucide="search" className="w-4 h-4"></i>
          <span className="text-xs font-medium uppercase tracking-widest hidden md:inline">Track Order</span>
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
        >
          <i data-lucide="shopping-cart" className="w-4 h-4"></i>
          <span className="text-xs font-medium uppercase tracking-widest hidden md:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
