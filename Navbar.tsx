'use client'

import { useState, useEffect } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Home, Search, ClipboardList, User, Settings, HelpCircle, LogOut, Tag, UserPlus, Info } from 'lucide-react'

/**
 * Production-ready Responsive Navbar
 * Refactored for modern App-like UX (Uber Eats/Glovo style)
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Main Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-orange-600" onClick={closeMenu}>
            HASH FOOD
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-semibold text-gray-700">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <Link href="/restaurants" className="hover:text-orange-600 transition-colors">Restaurants</Link>
            <Link href="/orders" className="hover:text-orange-600 transition-colors">Orders</Link>
            <Link href="/cart" className="relative hover:text-orange-600 transition-colors"><ShoppingCart size={22} /></Link>
            <Link href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-all shadow-md active:scale-95">
              Login
            </Link>
          </div>

          {/* Mobile Top Actions (Cart + Hamburger) */}
          <div className="flex md:hidden items-center space-x-2">
            <Link href="/cart" onClick={closeMenu} className="text-gray-700 p-2">
              <ShoppingCart size={24} />
            </Link>
            <button onClick={toggleMenu} className="p-2 text-gray-700 active:scale-90 transition-transform">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-lg border-t border-gray-100 h-20 pb-4 px-6 flex justify-between items-center shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <Link href="/" onClick={closeMenu} className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-orange-600' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Home</span>
        </Link>
        <Link href="/restaurants" onClick={closeMenu} className={`flex flex-col items-center gap-1 ${isActive('/restaurants') ? 'text-orange-600' : 'text-gray-400'}`}>
          <Search size={24} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Browse</span>
        </Link>
        <Link href="/cart" onClick={closeMenu} className={`flex flex-col items-center gap-1 ${isActive('/cart') ? 'text-orange-600' : 'text-gray-400'}`}>
          <ShoppingCart size={24} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Cart</span>
        </Link>
        <Link href="/orders" onClick={closeMenu} className={`flex flex-col items-center gap-1 ${isActive('/orders') ? 'text-orange-600' : 'text-gray-400'}`}>
          <ClipboardList size={24} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Orders</span>
        </Link>
        <button onClick={toggleMenu} className={`flex flex-col items-center gap-1 ${isOpen ? 'text-orange-600' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Account</span>
        </button>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[70] md:hidden bg-white transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <span className="text-2xl font-black text-orange-600">HASH FOOD</span>
            <button onClick={closeMenu} className="p-2 text-gray-700 bg-gray-50 rounded-full">
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <DrawerLink href="/" icon={<Home size={22} />} label="Home" onClick={closeMenu} />
            <DrawerLink href="/about" icon={<Info size={22} />} label="About" onClick={closeMenu} />
            <DrawerLink href="/profile" icon={<User size={22} />} label="Customer" onClick={closeMenu} />
            <DrawerLink href="/restaurants" icon={<Search size={22} />} label="Restaurants" onClick={closeMenu} />
            <DrawerLink href="/offers" icon={<Tag size={22} />} label="Offers" onClick={closeMenu} />
            <DrawerLink href="/orders" icon={<ClipboardList size={22} />} label="Track Order" onClick={closeMenu} />
            <DrawerLink href="/partner" icon={<UserPlus size={22} />} label="Become a Partner" onClick={closeMenu} />
            <DrawerLink href="/settings" icon={<Settings size={22} />} label="Settings" onClick={closeMenu} />
            <DrawerLink href="/help" icon={<HelpCircle size={22} />} label="Get Help" onClick={closeMenu} />

            <hr className="my-6 border-gray-100" />

            <div className="grid grid-cols-2 gap-4">
              <Link href="/login" onClick={closeMenu} className="flex items-center justify-center py-4 rounded-2xl font-bold border border-gray-200 text-gray-900 active:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link href="/signup" onClick={closeMenu} className="flex items-center justify-center py-4 rounded-2xl font-bold bg-orange-600 text-white shadow-lg shadow-orange-100 active:scale-95 transition-transform">
                Sign Up
              </Link>
            </div>

            <button onClick={closeMenu} className="w-full mt-4 flex items-center gap-4 p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors active:bg-red-100 active:scale-[0.98]">
              <LogOut size={22} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navs */}
      <div className="h-16" />
    </>
  )
}

/**
 * Sub-component for Drawer Links to maintain clean code
 */
function DrawerLink({ href, icon, label, onClick }: { href: LinkProps['href'], icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-4 p-4 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100 active:scale-[0.98]"
    >
      <span className="text-gray-400">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}