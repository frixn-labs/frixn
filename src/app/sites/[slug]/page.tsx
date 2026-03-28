import { redirect } from 'next/navigation'

// appaswamy.envitra.in/ → rewrite handles redirecting to /sites/appaswamy/admin/dashboard
// But if Next.js routes here via the rewrite, redirect to admin panel
export default function OrgRoot({ params }: { params: { slug: string } }) {
  redirect('/admin/dashboard')
}
