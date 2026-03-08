import { SidebarShell } from "@/components/sidebar-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen bg-background text-text-primary">
      <SidebarShell />
      <div className="flex-1">{children}</div>
    </section>
  );
}
