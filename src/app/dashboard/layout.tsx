import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-[280px]">
        <Header />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}