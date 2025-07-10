"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import FormSteps from "./form-steps"
import PasswordRecovery from "./password-recovery"

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)

  const steps = [
    { id: 1, title: "Email", description: "Enter your email address" },
    { id: 2, title: "Password", description: "Enter your password" },
    { id: 3, title: "Verify", description: "Complete login" },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Login submitted:", formData)
      // Handle successful login
    } catch (error) {
      setErrors({ email: "Invalid credentials. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  autoFocus
                />
              </div>
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => updateFormData("rememberMe", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button type="button" variant="link" className="px-0 text-sm" onClick={() => setShowRecovery(true)}>
                Forgot password?
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Ready to Sign In</h3>
              <p className="text-sm text-gray-600">Click below to complete your login</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remember me:</span>
                <span className="font-medium">{formData.rememberMe ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <FormSteps steps={steps} currentStep={currentStep} />

          {renderStep()}

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              {isLoading ? (
                "Signing in..."
              ) : currentStep === steps.length ? (
                "Sign In"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <PasswordRecovery isOpen={showRecovery} onClose={() => setShowRecovery(false)} />
    </>
  )
}
