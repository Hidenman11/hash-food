import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface FoodItemCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export function FoodItemCard({ id, name, description, imageUrl, price }: FoodItemCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden active:scale-[0.98]">
      <Link href={`/food/${id}`} className="block">
        <div className="relative w-full h-32 sm:h-40 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      </Link>
      <div className="p-3 flex flex-col justify-between h-[calc(100%-8rem)] sm:h-[calc(100%-10rem)]"> {/* Adjust height based on image height */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-gray-800">${price.toFixed(2)}</span>
          <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}