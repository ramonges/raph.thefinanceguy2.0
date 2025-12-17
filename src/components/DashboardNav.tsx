'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, XCircle, BarChart3, LogOut, User } from 'lucide-react'

interface Profile {
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

interface DashboardNavProps {
  profile: Profile | null
  onOpenStats: () => void
}

export default function DashboardNav({ profile, onOpenStats }: DashboardNavProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/training', label: 'Training', icon: BookOpen },
    { href: '/missed-questions', label: 'Missed Questions', icon: XCircle },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/90 border-b border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/training" className="logo text-xl">
          @raph.thefinanceguy
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa]'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={onOpenStats}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Statistics</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-[#1f2937] border-2 border-[#374151] hover:border-[#00d4aa] transition-colors overflow-hidden flex items-center justify-center"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-[#9ca3af]" />
              )}
            </button>

            {showMenu && (
              <div className="profile-menu">
                <div className="px-4 py-3 border-b border-[#1f2937]">
                  <p className="font-medium text-sm truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-[#6b7280] truncate">
                    {profile?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

