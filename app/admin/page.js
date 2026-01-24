'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [filter])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons()
    }
  }, [orders, modalOpen])

  const loadOrders = async () => {
    try {
      const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const openOrderModal = async (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setModalOpen(true)
    }
  }

  const closeOrderModal = () => {
    setModalOpen(false)
    setSelectedOrder(null)
  }

  const updateOrderStatus = async () => {
    if (!selectedOrder) return

    const status = document.getElementById('status-select').value

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      const result = await response.json()

      if (result.success) {
        setOrders(prevOrders =>
          prevOrders.map(o => o.id === selectedOrder.id ? { ...o, status } : o)
        )
        closeOrderModal()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const statusColors = {
    new: 'bg-red-500/20 text-red-400 border-red-500/50',
    preparing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    ready: 'bg-green-500/20 text-green-400 border-green-500/50',
    completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  const statusLabels = {
    new: 'New',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] antialiased min-h-screen">
        <div className="bg-noise"></div>

        {/* Header */}
        <header className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 z-40 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i data-lucide="chef-hat" className="w-6 h-6"></i>
              <h1 className="font-['Anton'] text-2xl uppercase">Chef Gone Wild - Admin</h1>
            </div>
            <Link href="/" className="text-sm hover:text-rose-500 transition-colors">Back to Menu</Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 lg:p-12">
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {['all', 'new', 'preparing', 'ready', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 hover:bg-white hover:text-black'
                }`}
              >
                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No orders found</div>
            ) : (
              filteredOrders.map(order => {
                const date = new Date(order.created_at).toLocaleString('en-KE', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })

                return (
                  <div
                    key={order.id}
                    onClick={() => openOrderModal(order.id)}
                    className={`bg-white/5 border-l-4 ${statusColors[order.status] || statusColors.new} border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-['Anton'] text-2xl uppercase mb-1">{order.order_number}</h3>
                        <p className="text-sm text-gray-400">{date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || statusColors.new}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-400">{order.customer_phone}</p>
                      <p className="text-sm uppercase">{order.order_type.replace('table-', 'Table ')}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">{order.item_count} item(s)</span>
                      <span className="font-bold text-xl">KSh {parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>

        {/* Order Detail Modal */}
        {modalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-['Anton'] text-4xl uppercase">Order {selectedOrder.order_number}</h2>
                  <button onClick={closeOrderModal} className="p-2 hover:bg-white/10 rounded-full">
                    <i data-lucide="x" className="w-6 h-6"></i>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Customer</p>
                    <p className="font-medium text-lg">{selectedOrder.customer_name}</p>
                    <p className="text-gray-400">{selectedOrder.customer_phone}</p>
                  </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Table</p>
                      <p className="font-medium uppercase">{selectedOrder.order_type.replace('table-', 'Table ')}</p>
                    </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Placed At</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_at).toLocaleString('en-KE', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  {selectedOrder.special_instructions && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Special Instructions</p>
                      <p className="font-medium">{selectedOrder.special_instructions}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start py-2 border-b border-white/10">
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
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex justify-between text-xl">
                      <span>Total:</span>
                      <span className="font-bold">KSh {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <label className="block text-sm font-medium mb-2">Update Status</label>
                  <select
                    id="status-select"
                    defaultValue={selectedOrder.status}
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 mb-4 focus:outline-none focus:border-rose-500"
                  >
                    <option value="new">New</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={updateOrderStatus}
                    className="w-full bg-white text-black py-3 px-6 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}
