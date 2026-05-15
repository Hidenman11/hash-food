import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface RestaurantCardProps {
  id: string
  name: string
  imageUrl: string
  rating: number
  deliveryTime: string
  priceRange: string
}

export function RestaurantCard({ id, name, imageUrl, rating, deliveryTime, priceRange }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden active:scale-[0.98]">
        {/* Image-first layout with aspect ratio */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            priority // Consider using priority for above-the-fold images
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
            <span>{rating.toFixed(1)}</span>
            <span className="mx-2">•</span>
            <span>{deliveryTime}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-base font-bold text-gray-800">{priceRange}</span>
            <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition-colors active:scale-95">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}