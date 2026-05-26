"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTheme } from "next-themes"
import { LogOut, Settings, Sun, Moon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRole } from "@/components/role-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HeaderProfile() {
  const { role, orgId } = useRole()
  const params = useParams()
  const slug = params?.slug as string
  const { theme, setTheme } = useTheme()

  const [user, setUser] = React.useState<any>(null)
  const [profileData, setProfileData] = React.useState<{ name?: string, photoUrl?: string } | null>(null)
  const [loading, setLoading] = React.useState(true)

  const isSuperAdmin = role === 'superadmin' || slug === 'superadmin'

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
      }
    })
  }, [])

  React.useEffect(() => {
    if (!role) return

    const loadProfile = async () => {
      setLoading(true)
      try {
        if (role === 'employee' && orgId) {
          const { data } = await supabase
            .from('employees')
            .select('name, photo_url')
            .eq('id', orgId)
            .single()
          if (data) {
            setProfileData({
              name: data.name,
              photoUrl: data.photo_url || undefined
            })
          }
        } else if (slug && slug !== 'superadmin') {
          const { data } = await supabase
            .from('organizations')
            .select('name, logo_url, admin_name')
            .eq('slug', slug)
            .single()
          if (data) {
            setProfileData({
              name: data.admin_name || data.name,
              photoUrl: data.logo_url || undefined
            })
          }
        } else {
          setProfileData({
            name: 'Super Admin',
            photoUrl: undefined
          })
        }
      } catch (err) {
        console.error("Error loading header profile details:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [role, orgId, slug])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const getInitials = () => {
    const displayName = profileData?.name || user?.user_metadata?.full_name || user?.email || 'U';
    const parts = displayName.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return displayName.slice(0, 2).toUpperCase()
  }

  const sessionLabel =
    role === "superadmin"
      ? "Super Admin Session"
      : role === "employee"
      ? "Employee Session"
      : "Admin Session Secure"

  const avatarUrl = profileData?.photoUrl || user?.user_metadata?.avatar_url

  return (
    <div className="flex items-center gap-4">
      {/* Authenticated indicator */}
      <div className="flex items-center gap-3 text-right">
        <div className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <div className="flex flex-col text-left text-xs leading-tight hidden sm:flex">
          <span className="font-bold tracking-tight text-foreground/90">Authenticated</span>
          <span className="truncate text-[10px] text-muted-foreground font-semibold">
            {sessionLabel}
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* User profile avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted border border-border overflow-hidden transition-transform active:scale-95 focus:outline-none hover:border-primary/45 shadow-sm">
            {loading ? (
              <div className="h-full w-full animate-pulse bg-muted-foreground/10" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {getInitials()}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-lg">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none text-foreground truncate">
                {profileData?.name || user?.user_metadata?.full_name || (role === "superadmin" ? "Super Admin" : "Workspace User")}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Settings option (only for admins/employees, not superadmin) */}
          {!isSuperAdmin && (
            <DropdownMenuItem asChild className="cursor-pointer gap-2 font-semibold">
              <Link href={`/sites/${slug}/admin/settings`}>
                <Settings className="w-4 h-4 text-muted-foreground" />
                Settings
              </Link>
            </DropdownMenuItem>
          )}

          {/* Theme Toggle option */}
          <DropdownMenuItem
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer gap-2 font-semibold"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4 text-muted-foreground" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-muted-foreground" />
                Light Mode
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 font-semibold cursor-pointer gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
