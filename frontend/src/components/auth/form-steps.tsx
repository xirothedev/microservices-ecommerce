"use client"

import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface FormStepsProps {
  steps: Step[]
  currentStep: number
}

export default function FormSteps({ steps, currentStep }: FormStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 transition-all duration-200
                  ${step.id < currentStep ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
