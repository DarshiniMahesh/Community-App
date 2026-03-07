"use client";

import { useState } from "react";
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

// ── Data ──────────────────────────────────────────────────────────
const religiousHierarchy = [
  {
    gotra: "Kashyap",
    pravaras: [
      { name: "Kashyap-Avatsara-Naidhruva", upanamas: ["Kaushik", "Kaushalya"] },
      { name: "Kashyap-Avatsara",           upanamas: ["Naitik", "Vaidik"] },
      { name: "Kashyap-Daival",             upanamas: ["Daival", "Kashyapiya"] },
    ],
  },
  {
    gotra: "Bharadwaj",
    pravaras: [
      { name: "Angirasa-Barhaspatya-Bharadwaj", upanamas: ["Gargya", "Bharadwaj"] },
      { name: "Bharadwaj-Gargya",               upanamas: ["Garg", "Gargya"] },
    ],
  },
  {
    gotra: "Vishwamitra",
    pravaras: [
      { name: "Vishwamitra-Devarata-Audala",  upanamas: ["Kaushik", "Madhavi"] },
      { name: "Vishwamitra-Madhuchhanda",     upanamas: ["Madhuchhanda", "Devarata"] },
    ],
  },
  {
    gotra: "Jamadagni",
    pravaras: [
      { name: "Bhargava-Chyavana-Jamadagni", upanamas: ["Jamadagni", "Apnavan"] },
      { name: "Jamadagni-Apnavan",           upanamas: ["Bhargava", "Richika"] },
    ],
  },
  {
    gotra: "Gautam",
    pravaras: [
      { name: "Angirasa-Ayasya-Gautam", upanamas: ["Gautam", "Sharadvat"] },
      { name: "Gautam-Sharadvat",       upanamas: ["Ayasya", "Nodha"] },
    ],
  },
  {
    gotra: "Atri",
    pravaras: [
      { name: "Atreya-Archanas-Syavasva", upanamas: ["Atreya", "Archanas", "Mudgala"] },
    ],
  },
  {
    gotra: "Vashishtha",
    pravaras: [
      { name: "Vashishtha-Maitravaruna-Koundilya", upanamas: ["Vashishtha", "Parashara", "Shakti"] },
    ],
  },
];

const kuladevatas = [
  "Kalika Devi",
  "Mahalaxmi",
  "Renuka Devi",
  "Tulja Bhavani",
  "Durga Devi",
  "Bhavani Mata",
  "Chamunda Devi",
  "Bhadrakali",
  "Lakshmi Devi",
  "Saraswati Devi",
  "Amba Devi",
  "Khandoba",
  "Venkateshwara",
  "Lakshmi Narayana",
  "Balaji",
  "Mahadev",
];

// ── Types ──────────────────────────────────────────────────────────
type Pravara = { name: string; upanamas: string[] };

const steps = [
  { id: "1", name: "Personal",  href: "/dashboard/profile/personal-details" },
  { id: "2", name: "Religious", href: "/dashboard/profile/religious-details" },
  { id: "3", name: "Family",    href: "/dashboard/profile/family-information" },
  { id: "4", name: "Location",  href: "/dashboard/profile/location-information" },
  { id: "5", name: "Education", href: "/dashboard/profile/education-profession" },
  { id: "6", name: "Economic",  href: "/dashboard/profile/economic-details" },
  { id: "7", name: "Review",    href: "/dashboard/profile/review-submit" },
];

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    gotra: "",
    pravara: "",
    upanama: "",
    kuladevata: "",
    kuladevataOther: "",   // "Other" free-text
    surnameInUse: "",
    surnameAsPerGotra: "",
    priestName: "",
    priestLocation: "",
  });

  const [pravaraOptions, setPravaraOptions] = useState<Pravara[]>([]);
  const [upanamaOptions, setUpanamaOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Handlers ──────────────────────────────────────────────────────
  const handleGotraChange = (value: string) => {
    const gotraData = religiousHierarchy.find((g) => g.gotra === value);
    setFormData((prev) => ({ ...prev, gotra: value, pravara: "", upanama: "", kuladevata: "", kuladevataOther: "" }));
    setPravaraOptions(gotraData?.pravaras || []);
    setUpanamaOptions([]);
    setErrors((e) => ({ ...e, gotra: "" }));
  };

  const handlePravaraChange = (value: string) => {
    const pravaraData = pravaraOptions.find((p) => p.name === value);
    setFormData((prev) => ({ ...prev, pravara: value, upanama: "", kuladevata: "", kuladevataOther: "" }));
    setUpanamaOptions(pravaraData?.upanamas || []);
    setErrors((e) => ({ ...e, pravara: "" }));
  };

  const handleUpanamaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, upanama: value, kuladevata: "", kuladevataOther: "" }));
    setErrors((e) => ({ ...e, upanama: "" }));
  };

  const handleKuladevataChange = (value: string) => {
    setFormData((prev) => ({ ...prev, kuladevata: value, kuladevataOther: "" }));
    setErrors((e) => ({ ...e, kuladevata: "" }));
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.gotra)   newErrors.gotra   = "Please select Gotra";
    if (!formData.pravara) newErrors.pravara = "Please select Pravara";
    if (!formData.upanama) newErrors.upanama = "Please select Upanama";
    if (!formData.kuladevata) newErrors.kuladevata = "Please select Kuladevata";
    if (formData.kuladevata === "Other" && !formData.kuladevataOther.trim())
      newErrors.kuladevataOther = "Please enter your Kuladevata";
    if (!formData.surnameInUse.trim()) newErrors.surnameInUse = "Surname in use is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => toast.success("Draft saved successfully!");

  const handleNext = () => {
    if (validate()) {
      toast.success("Religious details saved!");
      router.push("/dashboard/profile/family-information");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
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

      {/* ── Hierarchical Selection ── */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Religious Lineage (Hierarchical)</CardTitle>
          <CardDescription>
            Select your Gotra, Pravara, and Upanama. The options will filter based on your selections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Flow indicator */}
          <div className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-lg flex-wrap">
            {[
              { label: "Gotra",      sub: formData.gotra      || "Select first" },
              { label: "Pravara",    sub: formData.pravara    || "Filters based on Gotra" },
              { label: "Upanama",    sub: formData.upanama    || "Filters based on Pravara" },
              { label: "Kuladevata", sub: formData.kuladevata === "Other" ? formData.kuladevataOther || "Other" : formData.kuladevata || "Select after Upanama" },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[110px] truncate">{item.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowDown className="h-4 w-4 text-primary -rotate-90 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* Gotra */}
            <div className="space-y-2">
              <Label>Gotra <span className="text-destructive">*</span></Label>
              <Select value={formData.gotra} onValueChange={handleGotraChange}>
                <SelectTrigger className={errors.gotra ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select Gotra" />
                </SelectTrigger>
                <SelectContent>
                  {religiousHierarchy.map((g) => (
                    <SelectItem key={g.gotra} value={g.gotra}>{g.gotra}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gotra && <p className="text-xs text-destructive">{errors.gotra}</p>}
            </div>

            {/* Pravara */}
            <div className="space-y-2">
              <Label>Pravara <span className="text-destructive">*</span></Label>
              <Select value={formData.pravara} onValueChange={handlePravaraChange} disabled={!formData.gotra}>
                <SelectTrigger className={errors.pravara ? "border-destructive" : ""}>
                  <SelectValue placeholder={formData.gotra ? "Select Pravara" : "Select Gotra first"} />
                </SelectTrigger>
                <SelectContent>
                  {pravaraOptions.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pravara && <p className="text-xs text-destructive">{errors.pravara}</p>}
            </div>

            {/* Upanama */}
            <div className="space-y-2">
              <Label>Upanama <span className="text-destructive">*</span></Label>
              <Select value={formData.upanama} onValueChange={handleUpanamaChange} disabled={!formData.pravara}>
                <SelectTrigger className={errors.upanama ? "border-destructive" : ""}>
                  <SelectValue placeholder={formData.pravara ? "Select Upanama" : "Select Pravara first"} />
                </SelectTrigger>
                <SelectContent>
                  {upanamaOptions.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.upanama && <p className="text-xs text-destructive">{errors.upanama}</p>}
            </div>

            {/* Kuladevata — manual select, enabled after Upanama */}
            <div className="space-y-2">
              <Label>Kuladevata <span className="text-destructive">*</span></Label>
              <Select value={formData.kuladevata} onValueChange={handleKuladevataChange} disabled={!formData.upanama}>
                <SelectTrigger className={errors.kuladevata ? "border-destructive" : ""}>
                  <SelectValue placeholder={formData.upanama ? "Select Kuladevata" : "Select Upanama first"} />
                </SelectTrigger>
                <SelectContent>
                  {kuladevatas.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Not listed)</SelectItem>
                </SelectContent>
              </Select>
              {errors.kuladevata && <p className="text-xs text-destructive">{errors.kuladevata}</p>}
            </div>

          </div>

          {/* Other Kuladevata — shown only if "Other" selected */}
          {formData.kuladevata === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="kuladevataOther">
                Enter Kuladevata <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kuladevataOther"
                placeholder="Type your Kuladevata name"
                value={formData.kuladevataOther}
                onChange={(e) => {
                  setFormData({ ...formData, kuladevataOther: e.target.value });
                  setErrors({ ...errors, kuladevataOther: "" });
                }}
                className={errors.kuladevataOther ? "border-destructive" : ""}
              />
              {errors.kuladevataOther && <p className="text-xs text-destructive">{errors.kuladevataOther}</p>}
            </div>
          )}

        </CardContent>
      </Card>

      {/* ── Surname & Priest ── */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Surname & Priest Information</CardTitle>
        </CardHeader>
        <CardContent>
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
              {errors.surnameInUse && <p className="text-xs text-destructive">{errors.surnameInUse}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surnameAsPerGotra">Surname (As per Gotra)</Label>
              <Input
                id="surnameAsPerGotra"
                placeholder="Traditional surname"
                value={formData.surnameAsPerGotra}
                onChange={(e) => setFormData({ ...formData, surnameAsPerGotra: e.target.value })}
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
        <Button variant="outline" onClick={() => router.push("/dashboard/profile/personal-details")} className="gap-2">
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