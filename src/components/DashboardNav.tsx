'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, XCircle, BarChart3, LogOut, User, Layers, TrendingUp, Target, Share2, Menu, X, Building2, Library } from 'lucide-react'

interface Profile {
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

interface DashboardNavProps {
  profile: Profile | null
  onOpenStats: () => void
  blockType?: 'sales' | 'trading' | 'quant' | null
}

export default function DashboardNav({ profile, onOpenStats, blockType }: DashboardNavProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
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
    { href: '/select-block', label: 'Practice', icon: Target },
    { href: '/assets', label: 'Assets', icon: Layers },
    { href: '/strategies', label: 'Strategies', icon: TrendingUp },
    { href: '/missed-questions', label: 'Missed', icon: XCircle },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/resources', label: 'Resources', icon: Library },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/90 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
          <Link href="/select-block" className="logo text-sm sm:text-xl">
            @raph.thefinanceguy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-[#f97316]/10 text-[#f97316]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={onOpenStats}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Statistics</span>
            </button>

            <Link
              href="/sharing"
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                pathname === '/sharing'
                  ? 'bg-[#f97316]/10 text-[#f97316]'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Sharing</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-1 sm:ml-2" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1f2937] border-2 border-[#374151] hover:border-[#f97316] transition-colors overflow-hidden flex items-center justify-center"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af]" />
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

          {/* Mobile: Hamburger Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-8 h-8 rounded-lg bg-[#1f2937] border border-[#374151] hover:border-[#f97316] transition-colors flex items-center justify-center text-white"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="fixed top-[60px] left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-[#1f2937] md:hidden"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-[#f97316]/10 text-[#f97316]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                onOpenStats()
                setShowMobileMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Statistics</span>
            </button>

            <Link
              href="/sharing"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/sharing'
                  ? 'bg-[#f97316]/10 text-[#f97316]'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Sharing</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-[#1f2937]">
              <div className="px-4 py-2 mb-2">
                <p className="font-medium text-sm text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-[#6b7280] truncate">
                  {profile?.email}
                </p>
              </div>
              <button
                onClick={async () => {
                  await handleLogout()
                  setShowMobileMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}