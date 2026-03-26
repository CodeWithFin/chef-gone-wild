'use client'

import React, { useState } from 'react'
import { useCart } from './CartContext'

export default function CheckoutModal() {
  const { cart, checkoutOpen, setCheckoutOpen, setSuccessOpen, setOrderNumber, clearCart, total } = useCart()
  const [loading, setLoading] = useState(false)

  if (!checkoutOpen) return null

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const orderData = {
      customer_name: formData.get('customer-name'),
      customer_phone: formData.get('customer-phone'),
      order_type: formData.get('order-type'),
      special_instructions: formData.get('special-instructions'),
      items: cart.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity
      }))
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        setOrderNumber(result.order.order_number)
        setSuccessOpen(true)
        setCheckoutOpen(false)
        clearCart()
      } else {
        alert('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/20 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto text-stone-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Anton'] text-4xl uppercase">Checkout</h2>
          <button onClick={() => setCheckoutOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
            <i data-lucide="x" className="w-6 h-6"></i>
          </button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input type="text" name="customer-name" required className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <input type="tel" name="customer-phone" required className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500" placeholder="+254700000000" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Table Number *</label>
            <select name="order-type" required className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-rose-500 text-white">
              <option value="table-1">Table 1</option>
              <option value="table-2">Table 2</option>
              <option value="table-3">Table 3</option>
              <option value="table-4">Table 4</option>
              <option value="table-5">Table 5</option>
              <option value="table-6">Table 6</option>
              <option value="table-7">Table 7</option>
              <option value="table-8">Table 8</option>
              <option value="table-9">Table 9</option>
              <option value="table-10">Table 10</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Special Instructions</label>
            <textarea name="special-instructions" rows="3" className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500"></textarea>
          </div>

          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between text-xl mb-4">
              <span>Total:</span>
              <span className="font-bold">KSh {total.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 px-6 font-['Anton'] text-xl uppercase tracking-wide hover:bg-rose-500 hover:text-white transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
