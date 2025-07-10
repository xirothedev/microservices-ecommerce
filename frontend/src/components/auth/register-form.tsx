"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import FormSteps from "./form-steps"

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  company: string
  role: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { id: 1, title: "Personal", description: "Basic information" },
    { id: 2, title: "Contact", description: "Email and phone" },
    { id: 3, title: "Security", description: "Password setup" },
    { id: 4, title: "Profile", description: "Additional details" },
    { id: 5, title: "Complete", description: "Finish registration" },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<RegisterFormData> = {}

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
    }

    if (step === 2) {
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, and number"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (step === 4) {
      if (!formData.role) {
        newErrors.role = "Please select your role"
      }
    }

    if (step === 5) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions"
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
      console.log("Registration submitted:", formData)
      // Handle successful registration
    } catch (error) {
      setErrors({ email: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof RegisterFormData, value: string | boolean) => {
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                    autoFocus
                  />
                </div>
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
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

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.phone}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => updateFormData("company", e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-owner">Business Owner</SelectItem>
                  <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.role}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Almost Done!</h3>
              <p className="text-sm text-gray-600">Review your information and complete registration</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <p className="font-medium">{formData.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              {errors.agreeToTerms && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.agreeToTerms}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => updateFormData("subscribeNewsletter", checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="newsletter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subscribe to our newsletter for updates and tips
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join us and start your digital marketing journey</CardDescription>
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
              "Creating Account..."
            ) : currentStep === steps.length ? (
              "Create Account"
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
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
