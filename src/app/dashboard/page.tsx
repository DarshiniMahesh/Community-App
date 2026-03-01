"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Users,
  MapPin,
  GraduationCap,
  Wallet,
  FileText,
  Clock,
  CheckCircle2,
  Edit,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const profileSections = [
  { name: "Personal Details", icon: User, completed: true, href: "/dashboard/profile/personal-details" },
  { name: "Religious Details", icon: FileText, completed: true, href: "/dashboard/profile/religious-details" },
  { name: "Family Information", icon: Users, completed: false, href: "/dashboard/profile/family-information" },
  { name: "Location Information", icon: MapPin, completed: false, href: "/dashboard/profile/location-information" },
  { name: "Education & Profession", icon: GraduationCap, completed: false, href: "/dashboard/profile/education-profession" },
  { name: "Economic Details", icon: Wallet, completed: false, href: "/dashboard/profile/economic-details" },
  { name: "Review & Submit", icon: CheckCircle2, completed: false, href: "/dashboard/profile/review-submit" },
];

type ProfileStatus = "draft" | "pending" | "approved" | "rejected";

export default function Page() {
  const router = useRouter();

  // Mock data - in real app this would come from API/state
  const profileStatus: ProfileStatus = "draft";
  const completedSections = profileSections.filter(s => s.completed).length;
  const totalSections = profileSections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  const getStatusConfig = (status: ProfileStatus) => {
    switch (status) {
      case "draft":
        return {
          badge: <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">Draft</Badge>,
          message: "Your profile is incomplete. Continue filling out your information.",
          icon: <Edit className="h-5 w-5 text-gray-600" />,
        };
      case "pending":
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending Verification</Badge>,
          message: "Your profile is under review by the Sangha administration.",
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
        };
      case "approved":
        return {
          badge: <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>,
          message: "Your profile has been verified and approved by the Sangha.",
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        };
      case "rejected":
        return {
          badge: <Badge variant="destructive">Rejected</Badge>,
          message: "Your profile requires corrections. Please review the feedback and update.",
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
        };
    }
  };

  const statusConfig = getStatusConfig(profileStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your community profile and track your registration status
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {statusConfig.icon}
                Current Status
              </CardTitle>
              <CardDescription>{statusConfig.message}</CardDescription>
            </div>
            {statusConfig.badge}
          </div>
        </CardHeader>
      </Card>

      {/* Profile Completion Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete all sections to submit for approval</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {completedSections} of {totalSections} sections
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionPercentage} className="h-3" />

          <div className="grid gap-3">
            {profileSections.map((section) => (
              <div
                key={section.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.completed ? "bg-green-100" : "bg-muted"}`}>
                    <section.icon
                      className={`h-5 w-5 ${section.completed ? "text-green-700" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{section.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.completed ? "Completed" : "Not started"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {section.completed && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(section.href)}
                    className="gap-1"
                  >
                    {section.completed ? "Edit" : "Start"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and navigation shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/dashboard/profile/personal-details")}
            >
              <User className="h-6 w-6 text-primary" />
              <span>Continue Editing</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/dashboard/profile/review-submit")}
            >
              <FileText className="h-6 w-6 text-primary" />
              <span>Review Details</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/dashboard/status")}
            >
              <Clock className="h-6 w-6 text-primary" />
              <span>View Status</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              disabled
            >
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              <span className="text-muted-foreground">Submit Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-secondary border-secondary-foreground/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">Need Help?</CardTitle>
          <CardDescription className="text-secondary-foreground/70">
            Contact the Sangha administration for assistance with your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              Contact Support
            </Button>
            <Button variant="ghost">
              View Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}