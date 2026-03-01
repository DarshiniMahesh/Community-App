"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Save, ArrowDown } from "lucide-react";
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

// Mock hierarchical data
const gotras = ["Kashyap", "Bharadwaj", "Vishwamitra", "Jamadagni", "Gautam"];
const pravaraByGotra: Record<string, string[]> = {
  Kashyap: ["Kashyap-Avatsara-Naidhruva", "Kashyap-Avatsara", "Kashyap-Daival"],
  Bharadwaj: ["Angirasa-Barhaspatya-Bharadwaj", "Bharadwaj-Gargya"],
  Vishwamitra: ["Vishwamitra-Devarata-Audala", "Vishwamitra-Madhuchhanda"],
  Jamadagni: ["Bhargava-Chyavana-Jamadagni", "Jamadagni-Apnavan"],
  Gautam: ["Angirasa-Ayasya-Gautam", "Gautam-Sharadvat"],
};

const upanamaByPravara: Record<string, string[]> = {
  "Kashyap-Avatsara-Naidhruva": ["Kaushik", "Kaushalya"],
  "Kashyap-Avatsara": ["Naitik", "Vaidik"],
  "Angirasa-Barhaspatya-Bharadwaj": ["Gargya", "Bharadwaj"],
  "Vishwamitra-Devarata-Audala": ["Kaushik", "Madhavi"],
  "Bhargava-Chyavana-Jamadagni": ["Jamadagni", "Apnavan"],
};

const kuladevataByUpanama: Record<string, string> = {
  Kaushik: "Kalika Devi",
  Kaushalya: "Mahalaxmi",
  Gargya: "Renuka Devi",
  Bharadwaj: "Tulja Bhavani",
  Naitik: "Bhavani Mata",
};

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gotra: "",
    pravara: "",
    upanama: "",
    kuladevata: "",
    surnameInUse: "",
    surnameAsPerGotra: "",
    priestName: "",
    priestLocation: "",
  });

  const [availablePravara, setAvailablePravara] = useState<string[]>([]);
  const [availableUpanama, setAvailableUpanama] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.gotra) {
      setAvailablePravara(pravaraByGotra[formData.gotra] || []);
      setFormData((prev) => ({ ...prev, pravara: "", upanama: "", kuladevata: "" }));
    }
  }, [formData.gotra]);

  useEffect(() => {
    if (formData.pravara) {
      setAvailableUpanama(upanamaByPravara[formData.pravara] || []);
      setFormData((prev) => ({ ...prev, upanama: "", kuladevata: "" }));
    }
  }, [formData.pravara]);

  useEffect(() => {
    if (formData.upanama) {
      const kuladevata = kuladevataByUpanama[formData.upanama] || "";
      setFormData((prev) => ({ ...prev, kuladevata }));
    }
  }, [formData.upanama]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.gotra) newErrors.gotra = "Please select Gotra";
    if (!formData.pravara) newErrors.pravara = "Please select Pravara";
    if (!formData.upanama) newErrors.upanama = "Please select Upanama";
    if (!formData.surnameInUse.trim()) newErrors.surnameInUse = "Surname in use is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Religious details saved!");
      router.push("/dashboard/profile/family-information");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/profile/personal-details");
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
        <h1 className="text-3xl font-semibold text-foreground">Religious Details</h1>
        <p className="text-muted-foreground mt-1">
          Step 2 of 7: Enter your religious and lineage information
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={1} />

      {/* Hierarchical Selection */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Religious Lineage (Hierarchical)</CardTitle>
          <CardDescription>
            Select your Gotra, Pravara, and Upanama. The options will filter based on your selections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visual Flow Indicator */}
            <div className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-foreground">Gotra</div>
                <div className="text-xs text-muted-foreground mt-1">Select first</div>
              </div>
              <ArrowDown className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-foreground">Pravara</div>
                <div className="text-xs text-muted-foreground mt-1">Filters based on Gotra</div>
              </div>
              <ArrowDown className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-foreground">Upanama</div>
                <div className="text-xs text-muted-foreground mt-1">Filters based on Pravara</div>
              </div>
              <ArrowDown className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-foreground">Kuladevata</div>
                <div className="text-xs text-muted-foreground mt-1">Auto-filled</div>
              </div>
            </div>

            {/* Dropdown Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gotra">
                  Gotra <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.gotra}
                  onValueChange={(value) => {
                    setFormData({ ...formData, gotra: value });
                    setErrors({ ...errors, gotra: "" });
                  }}
                >
                  <SelectTrigger className={errors.gotra ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Gotra" />
                  </SelectTrigger>
                  <SelectContent>
                    {gotras.map((gotra) => (
                      <SelectItem key={gotra} value={gotra}>
                        {gotra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gotra && <p className="text-xs text-destructive">{errors.gotra}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pravara">
                  Pravara <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.pravara}
                  onValueChange={(value) => {
                    setFormData({ ...formData, pravara: value });
                    setErrors({ ...errors, pravara: "" });
                  }}
                  disabled={!formData.gotra}
                >
                  <SelectTrigger className={errors.pravara ? "border-destructive" : ""}>
                    <SelectValue
                      placeholder={formData.gotra ? "Select Pravara" : "Select Gotra first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePravara.map((pravara) => (
                      <SelectItem key={pravara} value={pravara}>
                        {pravara}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pravara && <p className="text-xs text-destructive">{errors.pravara}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="upanama">
                  Upanama <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.upanama}
                  onValueChange={(value) => {
                    setFormData({ ...formData, upanama: value });
                    setErrors({ ...errors, upanama: "" });
                  }}
                  disabled={!formData.pravara}
                >
                  <SelectTrigger className={errors.upanama ? "border-destructive" : ""}>
                    <SelectValue
                      placeholder={formData.pravara ? "Select Upanama" : "Select Pravara first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUpanama.map((upanama) => (
                      <SelectItem key={upanama} value={upanama}>
                        {upanama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.upanama && <p className="text-xs text-destructive">{errors.upanama}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kuladevata">Kuladevata (Auto-filled)</Label>
                <Input
                  id="kuladevata"
                  value={formData.kuladevata}
                  readOnly
                  placeholder="Will be auto-filled"
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Surname & Priest Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surnameInUse">
                Surname (In Use) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="surnameInUse"
                placeholder="Current surname"
                value={formData.surnameInUse}
                onChange={(e) => {
                  setFormData({ ...formData, surnameInUse: e.target.value });
                  setErrors({ ...errors, surnameInUse: "" });
                }}
                className={errors.surnameInUse ? "border-destructive" : ""}
              />
              {errors.surnameInUse && (
                <p className="text-xs text-destructive">{errors.surnameInUse}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surnameAsPerGotra">Surname (As per Gotra)</Label>
              <Input
                id="surnameAsPerGotra"
                placeholder="Traditional surname"
                value={formData.surnameAsPerGotra}
                onChange={(e) =>
                  setFormData({ ...formData, surnameAsPerGotra: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priestName">Family Priest Name</Label>
              <Input
                id="priestName"
                placeholder="Enter priest's name"
                value={formData.priestName}
                onChange={(e) => setFormData({ ...formData, priestName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priestLocation">Family Priest Location</Label>
              <Input
                id="priestLocation"
                placeholder="City, Village"
                value={formData.priestLocation}
                onChange={(e) => setFormData({ ...formData, priestLocation: e.target.value })}
              />
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
          <Button onClick={handleNext} className="gap-2">
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}