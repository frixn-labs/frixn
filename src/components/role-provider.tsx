"use client"

import React, { createContext, useContext } from 'react'

export type UserRole = 'superadmin' | 'org_admin' | 'employee'

interface RoleContextProps {
  role: UserRole
  orgId: string // If role === 'employee', this is the employee_id
  orgSlug: string
}

const RoleContext = createContext<RoleContextProps | null>(null)

export function RoleProvider({ 
  children, 
  session 
}: { 
  children: React.ReactNode
  session: RoleContextProps 
}) {
  return (
    <RoleContext.Provider value={session}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
