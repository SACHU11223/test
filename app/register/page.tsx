"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAgent, setIsAgent] = useState(false)
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register the user in your backend
    // For demo purposes, we'll just redirect to the appropriate page

    // Store user type in localStorage to maintain session
    localStorage.setItem("userType", isAgent ? "agent" : "user")

    if (isAgent) {
      router.push("/agent-dashboard")
    } else {
      router.push("/shop")
    }
  }

  // Animation sequence for elements
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-item")
    elements.forEach((el, index) => {
      ;(el as HTMLElement).style.animationDelay = `${index * 0.1}s`
    })
  }, [])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isAgent ? "bg-gradient-dark-agent" : "bg-gradient-dark-1"}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/90 border-0 animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <CardTitle
              className={`text-3xl font-bold text-center ${isAgent ? "text-gradient-agent" : "text-gradient-1"} animate-item animate-slide-down`}
            >
              {isAgent ? "Create Agent Account" : "Create Account"}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="agent-mode" className={`text-sm ${isAgent ? "text-orange-600" : "text-purple-600"}`}>
                Agent Mode
              </Label>
              <Switch
                id="agent-mode"
                checked={isAgent}
                onCheckedChange={setIsAgent}
                className={isAgent ? "data-[state=checked]:bg-orange-500" : ""}
              />
            </div>
          </div>
          <CardDescription className="text-center font-serif text-lg animate-item animate-slide-down">
            {isAgent
              ? "Join our marketplace as a seller to showcase your products"
              : "Join our exclusive shopping experience"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2 animate-item animate-slide-up">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 px-4 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
            <div className="space-y-2 animate-item animate-slide-up">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
            <div className="space-y-2 animate-item animate-slide-up">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 px-4 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className={`w-full h-12 text-white transition-all duration-300 animate-item animate-slide-up flex items-center justify-center gap-2 group ${isAgent ? "btn-gradient-agent" : "btn-gradient-1"}`}
            >
              {isAgent ? (
                <Store className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              ) : (
                <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              )}
              <span>{isAgent ? "Register as Agent" : "Create Account"}</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm animate-item animate-slide-up">
            Already have an account?{" "}
            <Link
              href="/login"
              className={`${isAgent ? "text-orange-600 hover:text-orange-800" : "text-purple-600 hover:text-purple-800"} hover:underline transition-colors duration-300 font-medium`}
            >
              Login {isAgent ? "as Agent" : ""}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

