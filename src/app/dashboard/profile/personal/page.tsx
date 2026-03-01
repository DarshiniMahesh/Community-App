"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Save, Upload } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: "1", name: "Personal", href: "/dashboard/profile/personal-details" },
  { id: "2", name: "Religious", href: "/dashboard/profile/religious-details" },
  { id: "3", name: "Family", href: "/dashboard/profile/family-information" },
  { id: "4", name: "Location", href: "/dashboard/profile/location-information" },
  { id: "5", name: "Education", href: "/dashboard/profile/education-profession" },
  { id: "6", name: "Economic", href: "/dashboard/profile/economic-details" },
  { id: "7", name: "Review", href: "/dashboard/profile/review-submit" },
];

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    profilePhoto: null as File | null,
    isMarried: false,
    spouseName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profilePhoto: "File size must be less than 5MB" });
        return;
      }
      setFormData({ ...formData, profilePhoto: file });
      setErrors({ ...errors, profilePhoto: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (formData.isMarried && !formData.spouseName.trim()) {
      newErrors.spouseName = "Spouse name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Personal details saved!");
      router.push("/dashboard/profile/religious-details");
    }
  };

  return (
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
        <h1 className="text-3xl font-semibold text-foreground">Personal Details</h1>
        <p className="text-muted-foreground mt-1">
          Step 1 of 7: Enter your basic personal information
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={0} />

      {/* Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setErrors({ ...errors, firstName: "" });
                }}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                placeholder="Enter middle name"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  setErrors({ ...errors, lastName: "" });
                }}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <Label>
              Gender <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => {
                setFormData({ ...formData, gender: value });
                setErrors({ ...errors, gender: "" });
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-xs text-destructive">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  setFormData({ ...formData, dateOfBirth: e.target.value });
                  setErrors({ ...errors, dateOfBirth: "" });
                }}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <div className="flex gap-2">
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.profilePhoto && (
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.profilePhoto.name}
                </p>
              )}
              {errors.profilePhoto && (
                <p className="text-xs text-destructive">{errors.profilePhoto}</p>
              )}
              <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
            </div>
          </div>

          {/* Marital Status */}
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <p className="text-sm text-muted-foreground">
                  Are you currently married?
                </p>
              </div>
              <Switch
                id="maritalStatus"
                checked={formData.isMarried}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isMarried: checked, spouseName: "" })
                }
              />
            </div>

            {formData.isMarried && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="spouseName">
                  Spouse Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="spouseName"
                  placeholder="Enter spouse's full name"
                  value={formData.spouseName}
                  onChange={(e) => {
                    setFormData({ ...formData, spouseName: e.target.value });
                    setErrors({ ...errors, spouseName: "" });
                  }}
                  className={errors.spouseName ? "border-destructive" : ""}
                />
                {errors.spouseName && (
                  <p className="text-xs text-destructive">{errors.spouseName}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleNext} className="gap-2">
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}