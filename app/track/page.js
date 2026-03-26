'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartModal from '../../components/CartModal'
import CheckoutModal from '../../components/CheckoutModal'
import SuccessModal from '../../components/SuccessModal'

function TrackPageContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) {
      setOrderNumber(orderParam)
      handleTrack(orderParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons()
    }
  }, [order])

  const handleTrack = async (orderNum) => {
    if (!orderNum) return

    setLoading(true)
    setError(false)

    try {
      const response = await fetch(`/api/orders/${orderNum}`)

      if (response.status === 404) {
        setError(true)
        setOrder(null)
        return
      }

      const data = await response.json()
      setOrder(data)
      setError(false)
    } catch (err) {
      console.error('Error tracking order:', err)
      setError(true)
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleTrack(orderNumber)
  }

  const updateStatusSteps = (status) => {
    const steps = {
      new: ['step-new'],
      preparing: ['step-new', 'step-preparing'],
      ready: ['step-new', 'step-preparing', 'step-ready'],
      completed: ['step-new', 'step-preparing', 'step-ready', 'step-completed']
    }

    return steps[status] || []
  }

  const activeSteps = order ? updateStatusSteps(order.status) : []

  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] antialiased min-h-screen">
        <div className="bg-noise"></div>
        <Navbar />

        {/* Main Content */}
        <main className="min-h-screen flex flex-col items-center justify-center p-6 pt-32">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="font-['Anton'] text-6xl lg:text-8xl uppercase tracking-tight mb-4 text-white">Track Your Order</h1>
              <p className="text-gray-400">Enter your order number to check the status</p>
            </div>

            {/* Search Form */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="Order number (e.g., CGW...)"
                  className="flex-1 bg-white/10 border border-white/20 rounded px-6 py-4 focus:outline-none focus:border-rose-500 text-lg text-white placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-12 py-4 rounded font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </form>
            </div>

            {/* Order Details */}
            {order && (
              <>
                {/* Status Timeline */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-6">
                  <h2 className="font-['Anton'] text-3xl uppercase mb-6 text-white">Order Status</h2>
                  <div className="space-y-6">
                    {[
                      { id: 'step-new', icon: 'check', label: 'Order Placed', desc: new Date(order.created_at).toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short' }) },
                      { id: 'step-preparing', icon: 'chef-hat', label: 'Preparing', desc: 'Your order is being prepared' },
                      { id: 'step-ready', icon: 'check-circle', label: 'Ready', desc: `Your order is ready at ${order.order_type.replace('table-', 'Table ')}` },
                      { id: 'step-completed', icon: 'package', label: 'Completed', desc: 'Order completed' }
                    ].map((step, index) => {
                      const isActive = activeSteps.includes(step.id)
                      const isCompleted = activeSteps.indexOf(step.id) < activeSteps.length - 1 && activeSteps.includes(step.id)

                      return (
                        <div
                          key={step.id}
                          className={`status-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`step-icon w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                                isActive || isCompleted
                                  ? isActive
                                    ? 'bg-rose-500 border-rose-500 text-white'
                                    : 'bg-green-500 border-green-500 text-white'
                                  : 'bg-white/10 border-white/20'
                              }`}
                            >
                              <i data-lucide={step.icon} className="w-6 h-6"></i>
                            </div>
                            <div>
                              <p className="font-bold text-white">{step.label}</p>
                              <p className="text-sm text-gray-400">{step.desc}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                  <h2 className="font-['Anton'] text-3xl uppercase mb-6 text-white">Order Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Order Number</p>
                      <p className="font-bold text-xl text-white">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Customer</p>
                      <p className="font-medium text-white">{order.customer_name}</p>
                      <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Table</p>
                      <p className="font-medium uppercase text-white">{order.order_type.replace('table-', 'Table ')}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-6">
                    <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-bold">Items</p>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white">{item.quantity}x {item.name}</p>
                            {order.special_instructions && (
                              <p className="text-sm text-gray-400 italic">" {order.special_instructions} "</p>
                            )}
                          </div>
                          <span className="font-bold text-white">KSh {parseFloat(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between text-2xl">
                      <span className="text-gray-400">Total:</span>
                      <span className="font-bold text-rose-500">KSh {parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/50 rounded-lg p-12 text-center backdrop-blur-sm">
                <i data-lucide="alert-circle" className="w-16 h-16 mx-auto mb-6 text-rose-500"></i>
                <p className="font-['Anton'] text-3xl uppercase text-white mb-2">Order Not Found</p>
                <p className="text-gray-400">Please check your order number and try again.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
        <CartModal />
        <CheckoutModal />
        <SuccessModal />
      </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">Loading Tracking System...</div>}>
      <TrackPageContent />
    </Suspense>
  )
}
