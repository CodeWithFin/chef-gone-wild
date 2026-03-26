import './globals.css'
import Script from 'next/script'
import { CartProvider } from '../components/CartContext'

export const metadata = {
  title: 'Chef Gone Wild - Order Online',
  description: 'Order delicious food from Chef Gone Wild',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <Script src="https://unpkg.com/lucide@latest" strategy="afterInteractive" />
      </body>
    </html>
  )
}
