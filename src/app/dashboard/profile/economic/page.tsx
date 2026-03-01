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

const incomeSlabs = [
  "Below ₹2 Lakh",
  "₹2-5 Lakh",
  "₹5-10 Lakh",
  "₹10-20 Lakh",
  "₹20-50 Lakh",
  "Above ₹50 Lakh",
];

const assets = [
  "Own House",
  "Agricultural Land",
  "Two Wheeler",
  "Four Wheeler (Car)",
];

const insuranceTypes = ["Health Insurance", "Life Insurance", "Term Insurance"];

const coverageOptions = ["Self", "Spouse", "Kids", "Parents", "All Family"];

const documentTypes = [
  "Aadhaar Card",
  "PAN Card",
  "Ration Card",
  "Property Records",
];

const investments = [
  "Fixed Deposit",
  "Mutual Fund / SIP",
  "Shares / Demat Account",
  "Others",
];

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    selfIncome: "",
    familyIncome: "",
  });

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);

  const [insuranceCoverage, setInsuranceCoverage] = useState<Record<string, string[]>>({
    "Health Insurance": [],
    "Life Insurance": [],
    "Term Insurance": [],
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File | null>>({
    "Aadhaar Card": null,
    "PAN Card": null,
    "Ration Card": null,
    "Property Records": null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleAsset = (asset: string) => {
    setSelectedAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  const toggleInvestment = (investment: string) => {
    setSelectedInvestments((prev) =>
      prev.includes(investment)
        ? prev.filter((i) => i !== investment)
        : [...prev, investment]
    );
  };

  const toggleInsuranceCoverage = (insuranceType: string, coverage: string) => {
    setInsuranceCoverage((prev) => ({
      ...prev,
      [insuranceType]: prev[insuranceType].includes(coverage)
        ? prev[insuranceType].filter((c) => c !== coverage)
        : [...prev[insuranceType], coverage],
    }));
  };

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [docType]: file,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.selfIncome) {
      newErrors.selfIncome = "Please select your income slab";
    }
    if (!formData.familyIncome) {
      newErrors.familyIncome = "Please select family income slab";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Economic details saved!");
      router.push("/dashboard/profile/review-submit");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/profile/education-profession");
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
        <h1 className="text-3xl font-semibold text-foreground">Economic Details</h1>
        <p className="text-muted-foreground mt-1">
          Step 6 of 7: Provide your financial and asset information
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={5} />

      {/* Income Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Income Information</CardTitle>
          <CardDescription>Annual income details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selfIncome">
                Self Income (Annual) <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.selfIncome}
                onValueChange={(value) => {
                  setFormData({ ...formData, selfIncome: value });
                  setErrors({ ...errors, selfIncome: "" });
                }}
              >
                <SelectTrigger className={errors.selfIncome ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  {incomeSlabs.map((slab) => (
                    <SelectItem key={slab} value={slab}>
                      {slab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selfIncome && (
                <p className="text-xs text-destructive">{errors.selfIncome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyIncome">
                Family Income (Annual) <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.familyIncome}
                onValueChange={(value) => {
                  setFormData({ ...formData, familyIncome: value });
                  setErrors({ ...errors, familyIncome: "" });
                }}
              >
                <SelectTrigger className={errors.familyIncome ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  {incomeSlabs.map((slab) => (
                    <SelectItem key={slab} value={slab}>
                      {slab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.familyIncome && (
                <p className="text-xs text-destructive">{errors.familyIncome}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Assets Owned</CardTitle>
          <CardDescription>Select all assets that you or your family owns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div
                key={asset}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedAssets.includes(asset)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleAsset(asset)}
              >
                <Checkbox
                  id={asset}
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => toggleAsset(asset)}
                />
                <Label htmlFor={asset} className="font-normal cursor-pointer flex-1">
                  {asset}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Insurance Coverage</CardTitle>
          <CardDescription>
            Select insurance types and coverage for family members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {insuranceTypes.map((insuranceType) => (
            <div key={insuranceType} className="p-4 rounded-lg border bg-muted/30">
              <Label className="text-base mb-3 block">{insuranceType}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {coverageOptions.map((coverage) => (
                  <div key={coverage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${insuranceType}-${coverage}`}
                      checked={insuranceCoverage[insuranceType].includes(coverage)}
                      onCheckedChange={() =>
                        toggleInsuranceCoverage(insuranceType, coverage)
                      }
                    />
                    <Label
                      htmlFor={`${insuranceType}-${coverage}`}
                      className="font-normal cursor-pointer text-sm"
                    >
                      {coverage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Document Uploads</CardTitle>
          <CardDescription>
            Upload copies of important documents (Optional but recommended)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {documentTypes.map((docType) => (
              <div key={docType} className="space-y-2">
                <Label htmlFor={docType}>{docType}</Label>
                <div className="flex gap-2">
                  <Input
                    id={docType}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      handleDocumentUpload(docType, e.target.files?.[0] || null)
                    }
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {uploadedDocuments[docType] && (
                  <p className="text-xs text-muted-foreground">
                    ✓ {uploadedDocuments[docType]?.name}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Supported formats: JPG, PNG, PDF (Max 5MB per file)
          </p>
        </CardContent>
      </Card>

      {/* Investments Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>Select your investment types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {investments.map((investment) => (
              <div
                key={investment}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedInvestments.includes(investment)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleInvestment(investment)}
              >
                <Checkbox
                  id={investment}
                  checked={selectedInvestments.includes(investment)}
                  onCheckedChange={() => toggleInvestment(investment)}
                />
                <Label htmlFor={investment} className="font-normal cursor-pointer flex-1">
                  {investment}
                </Label>
              </div>
            ))}
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
          <Button onClick={handleNext} className="gap-2">
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}