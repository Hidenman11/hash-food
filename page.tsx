'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
  })

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    console.log('Saving profile:', profile)
    setIsEditing(false)
  }

  const ProfileField = ({ icon, label, value, type = 'text', onChange }: { icon: React.ReactNode, label: string, value: string, type?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
      <span className="text-gray-400">{icon}</span>
      <div className="flex-grow">
        <p className="text-xs text-gray-500">{label}</p>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full text-gray-800 font-medium border-b border-gray-200 focus:border-orange-500 outline-none transition-colors"
          />
        ) : (
          <p className="text-gray-800 font-medium">{value}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Profile</h1>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-orange-600 text-white px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-2">
            {isEditing ? 'Save' : <><Edit size={18} /> Edit</>}
          </button>
        </div>

        <div className="space-y-4">
          <ProfileField icon={<User size={20} />} label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <ProfileField icon={<Mail size={20} />} label="Email Address" value={profile.email} type="email" onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <ProfileField icon={<Phone size={20} />} label="Phone Number" value={profile.phone} type="tel" onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <ProfileField icon={<MapPin size={20} />} label="Delivery Address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        </div>
      </div>
    </div>
  )
}