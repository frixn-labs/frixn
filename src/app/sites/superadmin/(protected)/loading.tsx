import { Loader2 } from "lucide-react"

export default function SuperAdminLoading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Verifying credentials...
        </p>
      </div>
    </div>
  )
}
