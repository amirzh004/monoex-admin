import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('authCredentials')
    router.push('/admin/login')
  }

  return (
    <header className="border-b bg-white fixed top-0 w-full z-10">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/logo-monoex.png" alt="MonoEX Logo" width={32} height={32} className="h-8 w-8" />
          <div>
            <h1 className="text-lg md:text-xl font-bold" style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}>
              MonoEX Consulting
            </h1>
            <p className="text-xs md:text-sm" style={{ color: "#2c3e50" }}>Панель администратора</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Выйти
        </Button>
      </div>
    </header>
  )
}