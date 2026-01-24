'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [expandedSection, setExpandedSection] = useState(null)

  useEffect(() => {
    loadMenu()
    
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
  }, [cart, menuItems, categories, currentSlide, expandedSection])

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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const addToCart = (menuItemId) => {
    const item = menuItems.find(i => i.id === menuItemId)
    if (!item) return

    setCart(prevCart => {
      const existingItem = prevCart.find(c => c.menu_item_id === menuItemId)
      if (existingItem) {
        return prevCart.map(c =>
          c.menu_item_id === menuItemId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      } else {
        return [...prevCart, {
          menu_item_id: menuItemId,
          name: item.name,
          price: item.price,
          quantity: 1
        }]
      }
    })
    setCartOpen(true)
  }

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, change) => {
    setCart(prevCart => {
      const newCart = [...prevCart]
      newCart[index].quantity += change
      if (newCart[index].quantity <= 0) {
        return newCart.filter((_, i) => i !== index)
      }
      return newCart
    })
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems

  // Get featured items for weekly highlights
  const featuredItems = menuItems.slice(0, 3)

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
        setCart([])
        setCartOpen(false)
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
    <div className="bg-[#0a0a0a] text-stone-200 font-['Space_Grotesk'] text-lg antialiased overflow-x-hidden selection:bg-rose-500 selection:text-white">
      <div className="bg-noise"></div>

      {/* Header */}
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

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE: Typography & Navigation */}
        <div className="relative pt-24 pb-12 px-6 lg:px-12 flex flex-col justify-between border-r border-white/10 z-10 bg-[#0a0a0a]">
          <div className="space-y-2">
            {/* Navigation Accordion Items */}
            <div 
              className="group border-b border-white/20 py-4 cursor-pointer"
              onClick={() => toggleSection('menu')}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors duration-300 leading-[0.9]">
                  Our Menu
                </h1>
                <i 
                  data-lucide={expandedSection === 'menu' ? 'x' : 'plus'} 
                  className={`w-8 h-8 lg:w-12 lg:h-12 text-white/50 group-hover:text-white transition-transform duration-300 ${expandedSection === 'menu' ? 'rotate-90' : ''}`}
                ></i>
              </div>
              {expandedSection === 'menu' && (
                <div className="pt-8 pb-4">
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div
                        key={category}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCategory(selectedCategory === category ? null : category)
                        }}
                        className={`py-2 cursor-pointer ${selectedCategory === category ? 'text-rose-500' : ''}`}
                      >
                        <h2 className="font-['Anton'] text-3xl uppercase">{category}</h2>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div 
              className="group border-b border-white/20 py-4 cursor-pointer"
              onClick={() => toggleSection('crafts')}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors duration-300 leading-[0.9]">
                  Crafts
                </h1>
                <i 
                  data-lucide={expandedSection === 'crafts' ? 'x' : 'plus'} 
                  className={`w-8 h-8 lg:w-12 lg:h-12 text-white/50 group-hover:text-white transition-transform duration-300 ${expandedSection === 'crafts' ? 'rotate-90' : ''}`}
                ></i>
              </div>
            </div>

            <div 
              className="group border-b border-white/20 py-4 cursor-pointer"
              onClick={() => toggleSection('events')}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors duration-300 leading-[0.9]">
                  Events
                </h1>
                <i 
                  data-lucide={expandedSection === 'events' ? 'x' : 'plus'} 
                  className={`w-8 h-8 lg:w-12 lg:h-12 text-white/50 group-hover:text-white transition-transform duration-300 ${expandedSection === 'events' ? 'rotate-90' : ''}`}
                ></i>
              </div>
            </div>

            <div 
              className="group border-b border-white/20 py-4 cursor-pointer"
              onClick={() => toggleSection('about')}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-['Anton'] text-7xl lg:text-8xl text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors duration-300 leading-[0.9]">
                  About Us
                </h1>
                <i 
                  data-lucide={expandedSection === 'about' ? 'x' : 'plus'} 
                  className={`w-8 h-8 lg:w-12 lg:h-12 text-white/50 group-hover:text-rose-500 transition-transform duration-300 ${expandedSection === 'about' ? 'scale-110' : ''}`}
                ></i>
              </div>
              
              {/* Expanded Content */}
              {expandedSection === 'about' && (
                <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-[#f0eadd] text-black p-6 rounded-sm transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-48 group/card">
                    <div>
                      <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">Philosophy</span>
                      <h3 className="font-['Anton'] text-3xl leading-none mt-2 uppercase tracking-tight">Farm to Glass</h3>
                    </div>
                    <p className="text-sm font-medium leading-tight opacity-80">Locally sourced botanicals for the modern palate.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#1a1a1a] border border-white/20 text-white p-6 rounded-sm transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-48 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                      <i data-lucide="wine" className="w-32 h-32"></i>
                    </div>
                    <div>
                      <span className="bg-rose-500 text-white px-2 py-0.5 text-xs font-bold uppercase">New</span>
                      <h3 className="font-['Anton'] text-3xl leading-none mt-2 uppercase tracking-tight">Summer Mix</h3>
                    </div>
                    <p className="text-sm font-medium leading-tight text-gray-400">The 2024 cocktail roster is finally here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer of Left Side */}
          <div className="mt-12 lg:mt-24">
            <button 
              onClick={() => setCheckoutOpen(true)}
              className="inline-flex items-center justify-between w-full bg-white text-black py-4 px-6 font-['Anton'] text-2xl uppercase tracking-wide hover:bg-rose-500 hover:text-white transition-colors duration-300 group"
            >
              <span>Book A Table Now</span>
              <i data-lucide="arrow-right" className="group-hover:translate-x-2 transition-transform duration-300"></i>
            </button>

            <div className="flex justify-between items-end mt-12 text-sm font-medium text-gray-500">
              <div className="flex flex-col gap-1">
                <span className="text-white mb-2 font-bold uppercase">Locations</span>
                <a href="#" className="hover:text-rose-500 transition-colors">Downtown</a>
                <a href="#" className="hover:text-rose-500 transition-colors">Westside</a>
              </div>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-colors"><i data-lucide="instagram" className="w-5 h-5"></i></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-colors"><i data-lucide="facebook" className="w-5 h-5"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Visual Slideshow */}
        <div className="relative h-[60vh] lg:h-auto overflow-hidden bg-gray-900 border-l border-white/10">
          {/* Slideshow Images */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-opacity duration-1000 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0'}`}
              alt="Cocktail"
            />
            <img 
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-opacity duration-1000 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0'}`}
              alt="Roasted Chicken"
            />
            <img 
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" 
              className={`absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 saturate-50 transition-opacity duration-1000 ${currentSlide === 2 ? 'opacity-100' : 'opacity-0'}`}
              alt="Bar Interior"
            />
          </div>

          {/* Overlay Text on Image */}
          <div className="absolute top-1/2 left-6 lg:left-12 transform -translate-y-1/2 z-20 pointer-events-none mix-blend-overlay opacity-80">
            <h2 className="font-['Anton'] text-[10rem] lg:text-[14rem] leading-none text-white tracking-tighter opacity-30">
              TASTE
            </h2>
          </div>

          <div className="absolute bottom-6 right-6 z-30">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/20 text-white">
              <span>0{currentSlide + 1} / 03</span>
            </div>
          </div>
        </div>
      </main>

      {/* Scrolling Section: Featured Items */}
      <section className="relative bg-[#f4f4f0] text-black py-24 border-t border-black">
        <div className="px-6 lg:px-12 mb-12 flex items-end justify-between fade-enter scroll-trigger">
          <div>
            <p className="font-mono text-sm mb-2 text-rose-600 uppercase tracking-widest font-semibold">Curated Selection</p>
            <h2 className="font-['Anton'] text-6xl lg:text-8xl uppercase tracking-tight leading-none">
              Weekly <br />Highlights
            </h2>
          </div>
          <div className="hidden lg:block">
            <i data-lucide="move-right" className="w-12 h-12 text-black"></i>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 px-6 lg:px-12 pb-12 no-scrollbar snap-x snap-mandatory fade-enter scroll-trigger delay-100">
          {/* Featured Items */}
          {featuredItems.map((item, index) => (
            <div key={item.id} className="min-w-[85vw] md:min-w-[400px] snap-center group cursor-pointer">
              <div className="aspect-[4/5] bg-black overflow-hidden relative mb-4">
                <img 
                  src={item.image_url || 'https://via.placeholder.com/400x500'} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  alt={item.name}
                />
                <div className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 uppercase">{item.category}</div>
              </div>
              <div className="flex justify-between items-start border-t-2 border-black pt-4">
                <div>
                  <h3 className="font-['Anton'] text-3xl uppercase tracking-tight">{item.name}</h3>
                  <p className="text-gray-600 font-medium text-sm mt-1">{item.description || ''}</p>
                </div>
                <span className="font-bold text-xl">KSh {item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {/* Full Menu Card */}
          <div className="min-w-[85vw] md:min-w-[400px] snap-center group cursor-pointer">
            <div className="aspect-[4/5] bg-black overflow-hidden relative mb-4 flex items-center justify-center">
              <div className="text-center p-8 border-4 border-white z-10">
                <h4 className="font-['Anton'] text-5xl text-white uppercase mb-2">Full Menu</h4>
                <div className="w-12 h-1 bg-rose-500 mx-auto"></div>
              </div>
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" 
                className="absolute inset-0 w-full h-full object-cover brightness-50"
                alt="Full Menu"
              />
            </div>
            <div className="flex justify-between items-start border-t-2 border-black pt-4">
              <div>
                <h3 className="font-['Anton'] text-3xl uppercase tracking-tight">Explore More</h3>
                <p className="text-gray-600 font-medium text-sm mt-1">View our complete dining options</p>
              </div>
              <i data-lucide="arrow-right-circle" className="w-8 h-8"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="bg-black text-white pt-24 pb-12 px-6 lg:px-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 fade-enter scroll-trigger">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-['Anton'] text-6xl lg:text-8xl uppercase leading-none mb-6">
              Random <br />Answers
            </h2>
            <div className="flex gap-4 mt-8">
              <button className="bg-white text-black px-6 py-3 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors duration-300">FAQ</button>
              <button className="border border-white text-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors duration-300">Careers</button>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-end">
            <div className="space-y-4 font-medium text-gray-400">
              <p className="text-white text-xl">Chef Gone Wild</p>
              <p>123 Culinary Ave,<br />Nairobi, Kenya</p>
              <p>hello@chefgonewild.com</p>
              <p>+254 700 000 000</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/10 text-xs font-medium text-gray-600 uppercase tracking-widest">
          <p>© 2024 Chef Gone Wild.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setCartOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
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
                    <div key={index} className="cart-item bg-white/5 border border-white/10 rounded p-4">
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
                <div className="flex justify-between text-xl">
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
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
                <label className="block text-sm font-medium mb-2">Order Type *</label>
                <select name="order-type" required className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-rose-500 text-white">
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
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
      )}

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-lg max-w-md w-full p-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="check" className="w-10 h-10 text-white"></i>
              </div>
              <h2 className="font-['Anton'] text-4xl uppercase mb-2">Order Placed!</h2>
              <p className="text-gray-400">Your order number is</p>
              <p className="font-['Anton'] text-3xl text-rose-500 mt-2">{orderNumber}</p>
            </div>
            <p className="text-sm text-gray-400 mb-6">You will receive an SMS confirmation shortly.</p>
            <div className="flex gap-4">
              <Link href="/" className="flex-1 bg-white text-black py-3 px-6 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors text-center">
                New Order
              </Link>
              <Link href={`/track?order=${orderNumber}`} className="flex-1 border border-white text-white py-3 px-6 font-bold uppercase hover:bg-white hover:text-black transition-colors text-center">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
