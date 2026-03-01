"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Users,
  MapPin,
  GraduationCap,
  Wallet,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: "1",
    name: "Personal Details",
    description: "Basic personal information and profile photo",
    icon: User,
    href: "/dashboard/profile/personal-details",
  },
  {
    id: "2",
    name: "Religious Details",
    description: "Gotra, Pravara, Upanama, and Kuladevata information",
    icon: FileText,
    href: "/dashboard/profile/religious-details",
  },
  {
    id: "3",
    name: "Family Information",
    description: "Family members and relationships",
    icon: Users,
    href: "/dashboard/profile/family-information",
  },
  {
    id: "4",
    name: "Location Information",
    description: "Current address, hometown, and location history",
    icon: MapPin,
    href: "/dashboard/profile/location-information",
  },
  {
    id: "5",
    name: "Education & Profession",
    description: "Educational qualifications and professional details",
    icon: GraduationCap,
    href: "/dashboard/profile/education-profession",
  },
  {
    id: "6",
    name: "Economic Details",
    description: "Income, assets, insurance, and investments",
    icon: Wallet,
    href: "/dashboard/profile/economic-details",
  },
  {
    id: "7",
    name: "Review & Submit",
    description: "Review all information and submit for approval",
    icon: CheckCircle2,
    href: "/dashboard/profile/review-submit",
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Complete Your Profile</h1>
        <p className="text-muted-foreground mt-1">
          Fill out all sections to complete your registration with the community
        </p>
      </div>

      <Card className="bg-secondary border-secondary-foreground/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">Multi-Step Registration Process</CardTitle>
          <CardDescription className="text-secondary-foreground/70">
            Complete each section in sequence. You can save your progress and return later.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {index + 1} of {steps.length}
                      </span>
                    </div>
                    <CardTitle className="mt-1">{step.name}</CardTitle>
                    <CardDescription className="mt-1">{step.description}</CardDescription>
                  </div>
                </div>
                <Button onClick={() => router.push(step.href)} className="gap-2">
                  Start
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}