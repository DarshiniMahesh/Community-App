"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"

const steps = [
  { name: "Personal", path: "/dashboard/profile/personal-details" },
  { name: "Religious", path: "/dashboard/profile/religious-details" },
  { name: "Family", path: "/dashboard/profile/family-information" },
  { name: "Location", path: "/dashboard/profile/location-information" },
  { name: "Education", path: "/dashboard/profile/education-profession" },
  { name: "Economic", path: "/dashboard/profile/economic-details" },
  { name: "Review", path: "/dashboard/profile/review-submit" },
]

export default function ProfileLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path)
  )

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex

          return (
            <div key={step.name} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                      ? "border-2 border-primary text-primary"
                      : "border text-muted-foreground"
                  }
                `}
              >
                {index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 ${
                    index < currentStepIndex
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  )
}