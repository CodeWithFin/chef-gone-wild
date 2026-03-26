'use client'
 
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-white px-6">
      <h2 className="font-['Anton'] text-6xl lg:text-8xl uppercase mb-4">404</h2>
      <p className="text-gray-400 mb-8">Could not find requested resource</p>
      <Link 
        href="/"
        className="bg-white text-black py-3 px-8 font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
