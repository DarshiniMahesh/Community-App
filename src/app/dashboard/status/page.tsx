"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Edit,
  FileText,
  Calendar,
  User,
} from "lucide-react";

type StatusType = "draft" | "pending" | "approved" | "rejected";

// Mock data - in real app this would come from API
const statusData = {
  status: "pending" as StatusType,
  submittedDate: "28 Feb 2026",
  reviewedDate: null,
  reviewedBy: null,
  comments: [],
  timeline: [
    {
      date: "28 Feb 2026, 10:30 AM",
      status: "submitted",
      title: "Profile Submitted",
      description: "Your profile has been successfully submitted for review.",
      icon: FileText,
    },
    {
      date: "28 Feb 2026, 11:00 AM",
      status: "reviewing",
      title: "Under Review",
      description: "Sangha administration is currently reviewing your profile.",
      icon: Clock,
    },
  ],
};

const getStatusConfig = (status: StatusType) => {
  switch (status) {
    case "draft":
      return {
        badge: (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
            Draft
          </Badge>
        ),
        icon: <Edit className="h-12 w-12 text-gray-600" />,
        title: "Profile Not Submitted",
        description: "Your profile is still in draft mode. Complete all sections and submit for approval.",
        color: "bg-gray-100",
      };
    case "pending":
      return {
        badge: (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending Verification
          </Badge>
        ),
        icon: <Clock className="h-12 w-12 text-yellow-600" />,
        title: "Under Review",
        description: "Your profile has been submitted and is currently being reviewed by the Sangha administration.",
        color: "bg-yellow-50",
      };
    case "approved":
      return {
        badge: (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Approved
          </Badge>
        ),
        icon: <CheckCircle2 className="h-12 w-12 text-green-600" />,
        title: "Profile Approved",
        description: "Congratulations! Your profile has been verified and approved by the Sangha.",
        color: "bg-green-50",
      };
    case "rejected":
      return {
        badge: <Badge variant="destructive">Rejected</Badge>,
        icon: <XCircle className="h-12 w-12 text-destructive" />,
        title: "Profile Rejected",
        description: "Your profile requires corrections. Please review the feedback below and resubmit.",
        color: "bg-red-50",
      };
  }
};

export default function Page() {
  const router = useRouter();
  const config = getStatusConfig(statusData.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Application Status</h1>
        <p className="text-muted-foreground mt-1">
          Track the progress of your profile verification
        </p>
      </div>

      {/* Status Card */}
      <Card className={`shadow-sm border-l-4 ${statusData.status === "pending" ? "border-l-yellow-500" : statusData.status === "approved" ? "border-l-green-500" : statusData.status === "rejected" ? "border-l-red-500" : "border-l-gray-400"}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-full ${config.color}`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{config.title}</CardTitle>
                  {config.badge}
                </div>
                <CardDescription className="text-base">{config.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline */}
      {statusData.status !== "draft" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Review Timeline</CardTitle>
            <CardDescription>Track the progress of your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              {/* Timeline Items */}
              <div className="space-y-8">
                {statusData.timeline.map((item, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10 shadow-sm">
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}

                {/* Next Step (if pending) */}
                {statusData.status === "pending" && (
                  <div className="relative flex gap-4 opacity-50">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center z-10">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-muted-foreground">Awaiting Approval</h4>
                      <p className="text-sm text-muted-foreground">
                        Final verification and approval by Sangha administrator
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">
                  {statusData.submittedDate || "Not yet submitted"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <p className="font-medium capitalize">{statusData.status}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-sm bg-secondary/30">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.status === "draft" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Complete your profile and submit it for approval to proceed with registration.
              </p>
              <Button onClick={() => router.push("/dashboard/profile")} className="gap-2">
                <Edit className="h-4 w-4" />
                Continue Editing Profile
              </Button>
            </div>
          )}

          {statusData.status === "pending" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your profile is under review. You will be notified once the verification is
                complete. This typically takes 2-3 business days.
              </p>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          )}

          {statusData.status === "approved" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your profile has been approved! You can now access all community features.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/profile/review-submit")}>
                  View Profile
                </Button>
              </div>
            </div>
          )}

          {statusData.status === "rejected" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please review the feedback and make necessary corrections to your profile.
              </p>
              <Button onClick={() => router.push("/dashboard/profile")} variant="destructive" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit & Resubmit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="shadow-sm border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help or have questions about your application?
            </p>
            <Button variant="outline" className="mt-3">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}