'use client'

import React from 'react'
import { useCart } from './CartContext'

export default function CartModal() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, total, setCheckoutOpen } = useCart()

  if (!cartOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)}></div>
      <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-[#0a0a0a] border-l border-white/10 z-[60] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 text-white">
            <h2 className="font-['Anton'] text-4xl uppercase">Your Order</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item bg-white/5 border border-white/10 rounded p-4 text-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{item.name}</h4>
                    <button onClick={() => removeFromCart(index)} className="text-gray-400 hover:text-rose-500">
                      <i data-lucide="x" className="w-4 h-4"></i>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(index, -1)} className="bg-white/10 px-2 py-1 rounded hover:bg-white/20">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="bg-white/10 px-2 py-1 rounded hover:bg-white/20">+</button>
                    </div>
                    <span className="font-bold">KSh {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/20 pt-4 space-y-4">
            <div className="flex justify-between text-xl text-stone-200">
              <span>Total:</span>
              <span className="font-bold">KSh {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                setCartOpen(false)
                setCheckoutOpen(true)
              }}
              disabled={cart.length === 0}
              className="w-full bg-white text-black py-4 px-6 font-['Anton'] text-xl uppercase tracking-wide hover:bg-rose-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
