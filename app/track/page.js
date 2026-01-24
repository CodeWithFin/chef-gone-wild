'use client'

import { useEffect, useState, Suspense } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

        {/* Header */}
        <header className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 z-40 px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 border border-white/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors">
                <i data-lucide="chef-hat" className="w-4 h-4"></i>
              </div>
              <span className="font-bold tracking-tight uppercase text-sm cursor-pointer">Chef Gone Wild</span>
            </Link>
            <Link href="/" className="text-sm hover:text-rose-500 transition-colors">Back to Menu</Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="font-['Anton'] text-6xl lg:text-8xl uppercase tracking-tight mb-4">Track Your Order</h1>
              <p className="text-gray-400">Enter your order number to check the status</p>
            </div>

            {/* Search Form */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="Enter order number (e.g., CGW12345678)"
                  className="flex-1 bg-white/10 border border-white/20 rounded px-6 py-4 focus:outline-none focus:border-rose-500 text-lg text-white placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-8 py-4 rounded font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
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
                  <h2 className="font-['Anton'] text-3xl uppercase mb-6">Order Status</h2>
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
                              <p className="font-bold">{step.label}</p>
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
                  <h2 className="font-['Anton'] text-3xl uppercase mb-6">Order Details</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Order Number</p>
                      <p className="font-bold text-xl">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Customer</p>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Table</p>
                      <p className="font-medium uppercase">{order.order_type.replace('table-', 'Table ')}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-sm text-gray-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start py-2">
                          <div>
                            <p className="font-medium">{item.quantity}x {item.name}</p>
                            {item.special_instructions && (
                              <p className="text-sm text-gray-400">Note: {item.special_instructions}</p>
                            )}
                          </div>
                          <span className="font-bold">KSh {parseFloat(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-xl">
                      <span>Total:</span>
                      <span className="font-bold">KSh {parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
                <i data-lucide="alert-circle" className="w-12 h-12 mx-auto mb-4 text-red-400"></i>
                <p className="font-bold text-lg mb-2">Order Not Found</p>
                <p className="text-gray-400">Please check your order number and try again.</p>
              </div>
            )}
          </div>
        </main>
      </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <TrackPageContent />
    </Suspense>
  )
}
