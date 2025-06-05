import { AdminNav } from "@/components/admincomponents/AdminNav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminNav>{children}</AdminNav>
}