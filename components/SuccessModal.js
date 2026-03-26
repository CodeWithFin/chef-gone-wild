'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'

export default function SuccessModal() {
  const { successOpen, setSuccessOpen, orderNumber } = useCart()

  if (!successOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/20 rounded-lg max-w-md w-full p-6 text-center text-stone-200">
        <div className="mb-6">
          <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="check" className="w-10 h-10 text-white"></i>
          </div>
          <h2 className="font-['Anton'] text-4xl uppercase mb-2 text-white">Order Placed!</h2>
          <p className="text-gray-400">Your order number is</p>
          <p className="font-['Anton'] text-3xl text-rose-500 mt-2">{orderNumber}</p>
        </div>
        <p className="text-sm text-gray-400 mb-6">You will receive an SMS confirmation shortly.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setSuccessOpen(false)}
            className="flex-1 bg-white text-black py-3 px-6 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors text-center"
          >
            New Order
          </button>
          <Link 
            href={`/track?order=${orderNumber}`} 
            className="flex-1 border border-white text-white py-3 px-6 font-bold uppercase hover:bg-white hover:text-black transition-colors text-center"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
