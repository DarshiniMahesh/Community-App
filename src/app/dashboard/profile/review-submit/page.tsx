"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Save, Send, Edit, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const steps = [
  { id: "1", name: "Personal", href: "/dashboard/profile/personal-details" },
  { id: "2", name: "Religious", href: "/dashboard/profile/religious-details" },
  { id: "3", name: "Family", href: "/dashboard/profile/family-information" },
  { id: "4", name: "Location", href: "/dashboard/profile/location-information" },
  { id: "5", name: "Education", href: "/dashboard/profile/education-profession" },
  { id: "6", name: "Economic", href: "/dashboard/profile/economic-details" },
  { id: "7", name: "Review", href: "/dashboard/profile/review-submit" },
];

// Mock data - in real app this would come from state/API
const reviewData = {
  personal: {
    name: "Rajesh Kumar Sharma",
    gender: "Male",
    dateOfBirth: "15/03/1990",
    maritalStatus: "Married",
    spouseName: "Priya Sharma",
  },
  religious: {
    gotra: "Kashyap",
    pravara: "Kashyap-Avatsara-Naidhruva",
    upanama: "Kaushik",
    kuladevata: "Kalika Devi",
    surnameInUse: "Sharma",
    priestName: "Pt. Ramesh Joshi",
    priestLocation: "Pune, Maharashtra",
  },
  family: {
    type: "Joint Family",
    members: [
      { relation: "Father", name: "Kumar Sharma", age: "65", status: "Active" },
      { relation: "Mother", name: "Sunita Sharma", age: "60", status: "Active" },
      { relation: "Spouse", name: "Priya Sharma", age: "32", status: "Active" },
    ],
  },
  location: {
    current: "Flat 301, Green Valley Apartments, MG Road, Pune, Maharashtra - 411001",
    hometown: "Village Shivpur, Dist. Nashik, Maharashtra - 422001",
    previousAddresses: 2,
  },
  education: {
    highest: "Master's Degree",
    certifications: ["PMP Certified", "AWS Solutions Architect"],
    profession: "IT/Software",
    employment: "Private Sector",
    languages: ["Hindi", "Marathi", "English", "Sanskrit"],
  },
  economic: {
    selfIncome: "₹10-20 Lakh",
    familyIncome: "₹20-50 Lakh",
    assets: ["Own House", "Two Wheeler", "Four Wheeler"],
    insurance: ["Health Insurance (All Family)", "Life Insurance (Self, Spouse)"],
    investments: ["Fixed Deposit", "Mutual Fund / SIP"],
  },
};

// ✅ FIX: Separate component renders Edit button INSIDE AccordionContent, not inside AccordionTrigger
// This avoids <button> inside <button> which causes hydration errors

export default function Page() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (!confirmed) {
      setErrors({ confirmation: "Please confirm that all details are accurate" });
      return;
    }
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = () => {
    toast.success("Profile submitted successfully for approval!");
    setShowSubmitDialog(false);
    router.push("/dashboard/status");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleBack = () => {
    router.push("/dashboard/profile/economic-details");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/profile")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">Review & Submit</h1>
          <p className="text-muted-foreground mt-1">
            Step 7 of 7: Review all your information before submitting for approval
          </p>
        </div>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={6} />

        {/* Review Sections */}
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">

              {/* Personal Details */}
              <AccordionItem value="item-1">
                <AccordionTrigger>Personal Details</AccordionTrigger>
                <AccordionContent>
                  {/* ✅ Edit button now lives here, inside AccordionContent — not inside AccordionTrigger */}
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/personal-details")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{reviewData.personal.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Gender</Label>
                      <p className="font-medium">{reviewData.personal.gender}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <p className="font-medium">{reviewData.personal.dateOfBirth}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Marital Status</Label>
                      <p className="font-medium">{reviewData.personal.maritalStatus}</p>
                    </div>
                    {reviewData.personal.spouseName && (
                      <div>
                        <Label className="text-muted-foreground">Spouse Name</Label>
                        <p className="font-medium">{reviewData.personal.spouseName}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Religious Details */}
              <AccordionItem value="item-2">
                <AccordionTrigger>Religious Details</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/religious-details")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Gotra</Label>
                      <p className="font-medium">{reviewData.religious.gotra}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Pravara</Label>
                      <p className="font-medium">{reviewData.religious.pravara}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Upanama</Label>
                      <p className="font-medium">{reviewData.religious.upanama}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Kuladevata</Label>
                      <p className="font-medium">{reviewData.religious.kuladevata}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Surname (In Use)</Label>
                      <p className="font-medium">{reviewData.religious.surnameInUse}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Family Priest</Label>
                      <p className="font-medium">{reviewData.religious.priestName}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Family Information */}
              <AccordionItem value="item-3">
                <AccordionTrigger>Family Information</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/family-information")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Family Type</Label>
                      <p className="font-medium">{reviewData.family.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Family Members</Label>
                      <div className="mt-2 space-y-2">
                        {reviewData.family.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.relation}, Age: {member.age}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Location Information */}
              <AccordionItem value="item-4">
                <AccordionTrigger>Location Information</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/location-information")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Current Address</Label>
                      <p className="font-medium">{reviewData.location.current}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Home Town</Label>
                      <p className="font-medium">{reviewData.location.hometown}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Previous Addresses</Label>
                      <p className="font-medium">
                        {reviewData.location.previousAddresses} address(es) recorded
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Education & Profession */}
              <AccordionItem value="item-5">
                <AccordionTrigger>Education & Profession</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/education-profession")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Highest Education</Label>
                      <p className="font-medium">{reviewData.education.highest}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Profession</Label>
                      <p className="font-medium">{reviewData.education.profession}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Employment Type</Label>
                      <p className="font-medium">{reviewData.education.employment}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Certifications</Label>
                      <p className="font-medium">
                        {reviewData.education.certifications.join(", ")}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground">Languages</Label>
                      <p className="font-medium">
                        {reviewData.education.languages.join(", ")}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Economic Details */}
              <AccordionItem value="item-6">
                <AccordionTrigger>Economic Details</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/profile/economic-details")}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Self Income</Label>
                      <p className="font-medium">{reviewData.economic.selfIncome}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Family Income</Label>
                      <p className="font-medium">{reviewData.economic.familyIncome}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Assets</Label>
                      <p className="font-medium">{reviewData.economic.assets.join(", ")}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Investments</Label>
                      <p className="font-medium">
                        {reviewData.economic.investments.join(", ")}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground">Insurance</Label>
                      <p className="font-medium">{reviewData.economic.insurance.join(", ")}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card className="shadow-sm bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="confirmation"
                checked={confirmed}
                onCheckedChange={(checked) => {
                  setConfirmed(checked as boolean);
                  setErrors({ ...errors, confirmation: "" });
                }}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="confirmation"
                  className="cursor-pointer leading-relaxed"
                >
                  I confirm that all the information provided above is accurate and true to the
                  best of my knowledge. I understand that providing false information may result
                  in rejection of my application.
                </Label>
                {errors.confirmation && (
                  <p className="text-xs text-destructive">{errors.confirmation}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Previous Step
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Submit Profile for Approval?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Once submitted, your profile will be locked and sent to the Sangha administration
              for verification. You will not be able to make changes until the review is
              complete.
              <br />
              <br />
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Yes, Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}