import Link from 'next/link'

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
}

export function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  if (totalItems === 0) return null; // Don't show if cart is empty

  return (
    <div className="md:hidden fixed bottom-20 left-0 right-0 z-50 px-4"> {/* Position above bottom nav */}
      <div className="bg-orange-600 text-white rounded-2xl shadow-lg p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{totalItems} Items</span>
          <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <Link
          href="/cart"
          className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full active:scale-95 transition-transform shadow-md"
        >
          View Cart
        </Link>
      </div>
    </div>
  )
}