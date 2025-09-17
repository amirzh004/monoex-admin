"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/proxy/legistation/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
      })

      console.log(response, 'response')

      if (response.ok) {
        localStorage.setItem('authCredentials', JSON.stringify({ username, password }))
        router.push('/admin')
      } else {
        setError("Неверное имя пользователя или пароль")
      }
    } catch (err) {
      setError("Ошибка подключения к серверу")
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo-monoex.png" 
              alt="MonoEX Logo" 
              width={80} 
              height={80} 
              className="h-20 w-20"
            />
          </div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}
          >
            MonoEX Consulting
          </h1>
          <p 
            className="text-gray-600"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Панель администратора
          </p>
        </div>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle 
              className="text-2xl text-center"
              style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}
            >
              Вход в систему
            </CardTitle>
            <CardDescription 
              className="text-center"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Введите ваши учетные данные для доступа к панели управления
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: "#2c3e50",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                Используйте учетные данные, предоставленные администратором
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}