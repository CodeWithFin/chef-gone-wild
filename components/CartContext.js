'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(c => c.menu_item_id === item.id)
      if (existingItem) {
        return prevCart.map(c =>
          c.menu_item_id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      } else {
        return [...prevCart, {
          menu_item_id: item.id,
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

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      cartOpen,
      setCartOpen,
      checkoutOpen,
      setCheckoutOpen,
      successOpen,
      setSuccessOpen,
      orderNumber,
      setOrderNumber,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
