"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Plus, 
  Trash, 
  Loader2, 
  Award, 
  TrendingUp,
  GripVertical 
} from "lucide-react"
import { useRole } from "@/components/role-provider"
import { Reorder } from "framer-motion"

export default function ManageProductsPage() {
    const params = useParams()
    const slug = params?.slug as string

    const [orgId, setOrgId] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const { role, orgId: sessionUserOrOrgId } = useRole()

    const [productsRecordId, setProductsRecordId] = React.useState<string | null>(null)
    const [products, setProducts] = React.useState<string[]>([])
    const [newProduct, setNewProduct] = React.useState<string>("")
    const [isAddingProduct, setIsAddingProduct] = React.useState(false)
    const [enquiredProducts, setEnquiredProducts] = React.useState<{ name: string; count: number }[]>([])

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .eq('slug', slug)
            .single()

        if (orgData) {
            setOrgId(orgData.id)
            
            // Fetch Products
            const { data: prodData } = await supabase
                .from('products')
                .select('*')
                .eq('org_id', orgData.id)
                .single()
            if (prodData) {
                setProductsRecordId(prodData.id)
                setProducts(prodData.products || [])
            } else {
                setProducts([])
                setProductsRecordId(null)
            }

            // Fetch Product Enquiry Insights from leads table
            let leadsQuery = supabase
                .from('leads')
                .select('product')
                .not('product', 'is', null)

            if (role === 'employee') {
                leadsQuery = leadsQuery.eq('employee_id', sessionUserOrOrgId)
            } else {
                leadsQuery = leadsQuery.eq('org_id', orgData.id)
            }

            const { data: leadsData } = await leadsQuery

            if (leadsData) {
                const productCounts: Record<string, number> = {}
                leadsData.forEach((lead: any) => {
                    const prodName = lead.product ? lead.product.trim() : ""
                    if (prodName) {
                        productCounts[prodName] = (productCounts[prodName] || 0) + 1
                    }
                })
                const sorted = Object.entries(productCounts)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                setEnquiredProducts(sorted)
            } else {
                setEnquiredProducts([])
            }
        }
        setLoading(false)
    }, [slug, role, sessionUserOrOrgId])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    React.useEffect(() => {
        if (!orgId) return

        const productsChannel = supabase
            .channel(`products-page:${orgId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'frixn', table: 'products', filter: `org_id=eq.${orgId}` },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        setProductsRecordId(null)
                        setProducts([])
                    } else {
                        const newRow = payload.new as any
                        setProductsRecordId(newRow.id)
                        setProducts(newRow.products || [])
                    }
                }
            )
            .subscribe()

        const filterPrefix = role === 'employee' ? `employee_id=eq.${sessionUserOrOrgId}` : `org_id=eq.${orgId}`
        const leadsChannel = supabase
            .channel(`leads-page:${orgId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'frixn', table: 'leads', filter: filterPrefix },
                () => { fetchData() }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(productsChannel)
            supabase.removeChannel(leadsChannel)
        }
    }, [orgId, fetchData])

    const handleAddProduct = async () => {
        if (!newProduct.trim() || !orgId) return
        if (products.includes(newProduct.trim())) {
            alert("This product is already in the list.")
            return
        }
        setIsAddingProduct(true)
        try {
            const updatedProducts = [...products, newProduct.trim()]
            if (productsRecordId) {
                const { error } = await supabase.from('products').update({ products: updatedProducts }).eq('id', productsRecordId)
                if (error) {
                    console.error("Supabase Update Error:", error)
                    alert(`Supabase Error: ${error.message}`)
                } else {
                    setProducts(updatedProducts)
                    setNewProduct("")
                }
            } else {
                const { data, error } = await supabase.from('products').insert({ org_id: orgId, products: updatedProducts }).select().single()
                if (error) {
                    console.error("Supabase Insert Error:", error)
                    alert(`Supabase Error: ${error.message}`)
                } else if (data) {
                    setProductsRecordId(data.id)
                    setProducts(updatedProducts)
                    setNewProduct("")
                }
            }
        } finally {
            setIsAddingProduct(false)
        }
    }

    const handleDeleteProduct = async (indexToDelete: number) => {
        if (!productsRecordId) return
        const updatedProducts = products.filter((_, i) => i !== indexToDelete)
        setProducts(updatedProducts)
        await supabase.from('products').update({ products: updatedProducts }).eq('id', productsRecordId)
    }

    const handleReorder = async (newOrder: string[]) => {
        setProducts(newOrder)
        if (!productsRecordId) return
        try {
            await supabase.from('products').update({ products: newOrder }).eq('id', productsRecordId)
        } catch (err) {
            console.error("Failed to save reordered products:", err)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Products</h1>
                        <p className="text-sm text-muted-foreground">Configure products and services offered by your organization.</p>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {!loading && (
                <>
                    {/* Insights card */}
                    {enquiredProducts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Hero Card - Top Product */}
                            <div className="md:col-span-1 p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-background shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                                            {role === 'employee' ? 'My Top Performer' : 'Market Leader'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight mb-1 text-foreground break-words">{enquiredProducts[0].name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {role === 'employee' ? 'Most enquired product among your leads.' : 'Most requested product by potential clients.'}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-primary">{enquiredProducts[0].count}</span>
                                    <span className="text-xs text-muted-foreground font-medium">interested {enquiredProducts[0].count === 1 ? 'lead' : 'leads'}</span>
                                </div>
                            </div>

                            {/* Demand Breakdown */}
                            <div className="md:col-span-2 border rounded-2xl p-5 bg-background/50 flex flex-col gap-3.5 shadow-sm">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {role === 'employee' ? 'My Lead Interest breakdown' : 'Product Demand Breakdown'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-1">
                                    {enquiredProducts.map((item, idx) => {
                                        const totalCount = enquiredProducts.reduce((sum, p) => sum + p.count, 0)
                                        const percentage = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0
                                        return (
                                            <div key={idx} className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs font-semibold">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-[10px] font-bold text-muted-foreground w-4 text-right">{idx + 1}.</span>
                                                        <span className="truncate text-foreground font-medium">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-muted-foreground">{item.count} {item.count === 1 ? 'lead' : 'leads'}</span>
                                                        <Badge variant="outline" className="text-[9px] px-1 bg-muted/40 font-bold border-border">{percentage}%</Badge>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-primary h-full rounded-full transition-all duration-500" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Management List */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 flex items-center justify-between border-b bg-muted/20">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">Organization Products</span>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                                </Badge>
                            </div>
                            {role !== 'employee' && (
                                <span className="text-xs text-muted-foreground hidden sm:block">
                                    Changes save instantly
                                </span>
                            )}
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            {role !== 'employee' && (
                                <div className="flex items-center gap-3">
                                    <Input 
                                        placeholder="Add a new product/service..." 
                                        value={newProduct} 
                                        onChange={(e) => setNewProduct(e.target.value)} 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddProduct()
                                        }}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleAddProduct} disabled={isAddingProduct || !newProduct.trim()}>
                                        {isAddingProduct ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                        Add Product
                                    </Button>
                                </div>
                            )}

                            {products.length > 0 ? (
                                role === 'employee' ? (
                                    <div className="flex flex-col gap-2 mt-2">
                                        {products.map((product, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-background border px-4 py-3 rounded-lg group">
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-7 h-7 flex items-center justify-center bg-primary/10 text-primary rounded-md font-bold text-xs tabular-nums shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="font-semibold text-sm">{product}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Reorder.Group axis="y" values={products} onReorder={handleReorder} className="flex flex-col gap-2 mt-2">
                                        {products.map((product, idx) => (
                                            <Reorder.Item 
                                                key={product} 
                                                value={product}
                                                className="flex items-center justify-between bg-background border px-4 py-3 rounded-lg group cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
                                                    <div className="w-7 h-7 flex items-center justify-center bg-primary/10 text-primary rounded-md font-bold text-xs tabular-nums shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="font-semibold text-sm">{product}</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0" 
                                                    onClick={() => handleDeleteProduct(idx)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                )
                            ) : (
                                <div className="bg-background border px-4 py-8 rounded-lg mt-2 flex flex-col items-center justify-center text-center">
                                    <Package className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                    <span className="text-sm font-semibold text-foreground">No Products Defined</span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {role === 'employee' 
                                            ? "The organization has not defined any products or services yet." 
                                            : "Add your first custom product or package above."}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
