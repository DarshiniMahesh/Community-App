"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2 } from "lucide-react";
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

const educationLevels = [
  "Primary School",
  "High School",
  "Higher Secondary",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Professional Degree",
];

const professionTypes = [
  "Engineering",
  "Medical",
  "Teaching",
  "Business",
  "Agriculture",
  "Government Service",
  "IT/Software",
  "Banking/Finance",
  "Legal",
  "Arts/Media",
  "Other",
];

const employmentTypes = [
  "Private Sector",
  "Government",
  "Business Owner",
  "Freelancer",
  "Farmer",
  "Self-Employed",
  "Unemployed",
  "Retired",
  "Student",
  "Other",
];

const languages = [
  "Hindi",
  "Marathi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
  "Malayalam",
];

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    highestEducation: "",
    professionType: "",
    industry: "",
    employmentType: "",
  });

  const [certifications, setCertifications] = useState<string[]>([""]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const updateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.highestEducation) {
      newErrors.highestEducation = "Please select your highest education";
    }
    if (!formData.professionType) {
      newErrors.professionType = "Please select profession type";
    }
    if (!formData.employmentType) {
      newErrors.employmentType = "Please select employment type";
    }
    if (selectedLanguages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Education and profession details saved!");
      router.push("/dashboard/profile/economic-details");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/profile/location-information");
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
        <h1 className="text-3xl font-semibold text-foreground">Education & Profession</h1>
        <p className="text-muted-foreground mt-1">
          Step 5 of 7: Provide your educational and professional details
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={4} />

      {/* Education Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Educational Qualifications</CardTitle>
          <CardDescription>Your academic background and certifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="highestEducation">
              Highest Education <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.highestEducation}
              onValueChange={(value) => {
                setFormData({ ...formData, highestEducation: value });
                setErrors({ ...errors, highestEducation: "" });
              }}
            >
              <SelectTrigger className={errors.highestEducation ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your highest education" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.highestEducation && (
              <p className="text-xs text-destructive">{errors.highestEducation}</p>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Certifications / Additional Qualifications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCertification}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            </div>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Certification ${index + 1}`}
                    value={cert}
                    onChange={(e) => updateCertification(index, e.target.value)}
                  />
                  {certifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profession Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>Your current occupation and employment status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professionType">
                Profession Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.professionType}
                onValueChange={(value) => {
                  setFormData({ ...formData, professionType: value });
                  setErrors({ ...errors, professionType: "" });
                }}
              >
                <SelectTrigger className={errors.professionType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.professionType && (
                <p className="text-xs text-destructive">{errors.professionType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry / Field</Label>
              <Input
                id="industry"
                placeholder="E.g., Information Technology"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType">
              Employment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.employmentType}
              onValueChange={(value) => {
                setFormData({ ...formData, employmentType: value });
                setErrors({ ...errors, employmentType: "" });
              }}
            >
              <SelectTrigger className={errors.employmentType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employmentType && (
              <p className="text-xs text-destructive">{errors.employmentType}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Languages Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            Languages Known <span className="text-destructive">*</span>
          </CardTitle>
          <CardDescription>Select all languages you can speak or understand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={() => toggleLanguage(language)}
                />
                <Label
                  htmlFor={language}
                  className="font-normal cursor-pointer"
                >
                  {language}
                </Label>
              </div>
            ))}
          </div>
          {errors.languages && (
            <p className="text-xs text-destructive mt-2">{errors.languages}</p>
          )}
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
          <Button onClick={handleNext} className="gap-2">
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}