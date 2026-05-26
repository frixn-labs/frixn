"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Employee = {
    id: string
    name: string
    designation: string | null
    dept_id: string | null
    departments: any
}

interface DepartmentManageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orgId: string
    existingDept?: {
        id: string
        name: string
        description: string
    }
    onSuccess: () => void
}

export function DepartmentManageDialog({ open, onOpenChange, orgId, existingDept, onSuccess }: DepartmentManageDialogProps) {
    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')

    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [selectedEmployees, setSelectedEmployees] = React.useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = React.useState('')

    const [isLoading, setIsLoading] = React.useState(false)
    const [isFetchingEmployees, setIsFetchingEmployees] = React.useState(false)

    React.useEffect(() => {
        if (!open) return

        setSearchQuery('')

        if (existingDept) {
            setName(existingDept.name || '')
            setDescription(existingDept.description || '')
        } else {
            setName('')
            setDescription('')
        }

        async function init() {
            setIsFetchingEmployees(true)
            const { data } = await supabase
                .from('employees')
                .select('id, name, designation, dept_id, departments(name)')
                .eq('org_id', orgId)
                .order('name')

            const list: Employee[] = data || []
            setEmployees(list)

            if (existingDept) {
                const assigned = list.filter(e => e.dept_id === existingDept.id).map(e => e.id)
                setSelectedEmployees(new Set(assigned))
            } else {
                setSelectedEmployees(new Set())
            }

            setIsFetchingEmployees(false)
        }

        init()
    }, [open, orgId, existingDept])

    const handleSave = async () => {
        if (!name.trim()) return
        setIsLoading(true)

        try {
            const selectedArray = Array.from(selectedEmployees)

            if (existingDept) {
                const { error: deptError } = await supabase
                    .from('departments')
                    .update({
                        name: name.trim(),
                        description: description.trim() || null,
                    })
                    .eq('id', existingDept.id)

                if (deptError) throw deptError

                const { error: clearError } = await supabase
                    .from('employees')
                    .update({ dept_id: null })
                    .eq('dept_id', existingDept.id)

                if (clearError) throw clearError

                if (selectedArray.length > 0) {
                    const { error: assignError } = await supabase
                        .from('employees')
                        .update({ dept_id: existingDept.id })
                        .in('id', selectedArray)

                    if (assignError) throw assignError
                }
            } else {
                const { data: newDept, error: deptError } = await supabase
                    .from('departments')
                    .insert({
                        org_id: orgId,
                        name: name.trim(),
                        description: description.trim() || null,
                    })
                    .select()
                    .single()

                if (deptError) throw deptError

                if (newDept && selectedArray.length > 0) {
                    const { error: assignError } = await supabase
                        .from('employees')
                        .update({ dept_id: newDept.id })
                        .in('id', selectedArray)

                    if (assignError) throw assignError
                }
            }

            onSuccess()
            onOpenChange(false)
        } catch (err) {
            console.error('Save error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleEmployee = (id: string) => {
        setSelectedEmployees(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleAll = () => {
        if (selectedEmployees.size === employees.length) {
            setSelectedEmployees(new Set())
        } else {
            setSelectedEmployees(new Set(employees.map(e => e.id)))
        }
    }

    const allSelected = employees.length > 0 && selectedEmployees.size === employees.length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[760px] !w-[760px] p-0 overflow-hidden bg-background">
                <div className="flex h-[560px]">
                    {/* ── Left: Form ── */}
                    <div className="w-[340px] shrink-0 flex flex-col border-r border-border/50 bg-card overflow-hidden">
                        <div className="px-6 pt-5 pb-3 pr-12 border-b border-border/30">
                            <DialogHeader>
                                <DialogTitle className="text-base font-semibold">
                                    {existingDept ? 'Edit Department' : 'Add New Department'}
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs">
                                    {existingDept ? 'Update department details and employee assignments.' : 'Create a new organizational unit to group your employees.'}
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Department Name <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Sales, Engineering, Marketing"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={!name.trim() && isLoading ? 'border-destructive' : ''}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Description <span className="normal-case font-normal">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="Short brief about department functions..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex items-center gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !name.trim()}
                                className="flex-1 font-bold h-11"
                            >
                                {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                                {existingDept ? 'Save Changes' : 'Create Department'}
                            </Button>
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="font-bold h-11">
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* ── Right: Assignment ── */}
                    <div className="flex-1 flex flex-col bg-muted/20 relative min-w-0">
                        {/* Header */}
                        <div className="px-4 pt-5 pb-3 border-b border-border/50">
                            <div className="flex items-center justify-between pr-2 mb-3">
                                <h3 className="font-semibold text-sm">Assign Employees</h3>
                                {isFetchingEmployees ? (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Loading
                                    </span>
                                ) : (
                                    <div className="flex flex-col items-end leading-none">
                                        <span className="text-xs font-semibold text-blue-500 dark:text-blue-400">
                                            {selectedEmployees.size}
                                            <span className="text-muted-foreground font-medium text-[10px]"> / {employees.length}</span>
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-blue-500/70 mt-0.5">Selected</span>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search employees..."
                                    className="pl-8 h-8 text-xs bg-background"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Select All */}
                        <div className="flex px-4 py-2.5 bg-muted/40 border-b border-border/50 items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">Select All</span>
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={toggleAll}
                            />
                        </div>

                        {/* Employee List */}
                        <div className="flex-1 overflow-y-auto">
                            {isFetchingEmployees ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading employees...
                                </div>
                            ) : filteredEmployees.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    No employees found.
                                </div>
                            ) : (
                                <div className="p-3 space-y-1">
                                    {filteredEmployees.map(emp => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-background/80 transition-colors cursor-pointer"
                                            onClick={() => toggleEmployee(emp.id)}
                                        >
                                            <div className="flex flex-col min-w-0 flex-1">
                                                 <span className="text-sm font-medium truncate flex items-center">
                                                     {emp.name}
                                                     {(() => {
                                                         const deptName = Array.isArray(emp.departments) ? emp.departments[0]?.name : emp.departments?.name
                                                         if (!deptName || emp.dept_id === existingDept?.id) return null
                                                         return (
                                                             <span className="text-[9px] leading-none font-bold bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 py-1 px-2 rounded-full border border-blue-500/20 ml-2 whitespace-nowrap">
                                                                 {deptName}
                                                             </span>
                                                         )
                                                     })()}
                                                 </span>
                                                 {emp.designation && (
                                                     <span className="text-xs text-muted-foreground truncate">{emp.designation}</span>
                                                 )}
                                             </div>
                                            <Checkbox
                                                checked={selectedEmployees.has(emp.id)}
                                                onCheckedChange={() => toggleEmployee(emp.id)}
                                                onClick={e => e.stopPropagation()}
                                                className="shrink-0 ml-3"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
