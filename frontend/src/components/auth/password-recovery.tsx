"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle } from "lucide-react"

interface PasswordRecoveryProps {
  isOpen: boolean
  onClose: () => void
}

export default function PasswordRecovery({ isOpen, onClose }: PasswordRecoveryProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (error) {
      setError("Failed to send recovery email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setError("")
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Email Sent!</h3>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className={`pl-10 ${error ? "border-red-500" : ""}`}
                  autoFocus
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
