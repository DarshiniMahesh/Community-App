"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Save, User, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

// ── Steps ─────────────────────────────────────────────────────────
const steps = [
  { id: "1", name: "Personal",  href: "/dashboard/profile/personal-details" },
  { id: "2", name: "Religious", href: "/dashboard/profile/religious-details" },
  { id: "3", name: "Family",    href: "/dashboard/profile/family-information" },
  { id: "4", name: "Location",  href: "/dashboard/profile/location-information" },
  { id: "5", name: "Education", href: "/dashboard/profile/education-profession" },
  { id: "6", name: "Economic",  href: "/dashboard/profile/economic-details" },
  { id: "7", name: "Review",    href: "/dashboard/profile/review-submit" },
];

// ── Data ──────────────────────────────────────────────────────────
const incomeSlabs = [
  "Below ₹1 Lakh",
  "₹1 – 2 Lakh",
  "₹2 – 3 Lakh",
  "₹3 – 5 Lakh",
  "₹5 – 10 Lakh",
  "₹10 – 25 Lakh",
  "₹25 Lakh+",
];

const assets = [
  "Stay in Rented House",
  "Own a House",
  "Own Agricultural Land",
  "Own a Two Wheeler",
  "Own a Car (Four Wheeler)",
];

const insuranceTypes = ["Health Insurance", "Life Insurance", "Term Insurance"];

const documentTypes = [
  "Aadhaar Card",
  "PAN Card",
  "Ration Card",
  "All Records in Place (Land / Property / Pension / Govt)",
];

const investments = [
  "Fixed Deposits",
  "Mutual Funds / SIP",
  "Trading in Shares / Demat Account",
  "Other Investments",
];

// ── Mock family members — replace with real shared state later ────
const familyMembers = [
  { id: "self", name: "Self",    relation: "Self" },
  { id: "m1",   name: "Spouse", relation: "Spouse" },
  { id: "m2",   name: "Child 1",relation: "Son / Daughter" },
  { id: "m3",   name: "Father", relation: "Father" },
  { id: "m4",   name: "Mother", relation: "Mother" },
];

// ── Types ─────────────────────────────────────────────────────────
// insurance: { memberId: { "Health Insurance": true/false, ... } }
type InsuranceState = Record<string, Record<string, boolean>>;

// documents: { "Aadhaar Card": true/false/null }
type DocumentState = Record<string, boolean | null>;

function initInsurance(): InsuranceState {
  const state: InsuranceState = {};
  familyMembers.forEach((m) => {
    state[m.id] = {};
    insuranceTypes.forEach((t) => { state[m.id][t] = false; });
  });
  return state;
}

function initDocuments(): DocumentState {
  const state: DocumentState = {};
  documentTypes.forEach((d) => { state[d] = null; });
  return state;
}

// ── Page ──────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();

  const [selfIncome,   setSelfIncome]   = useState("");
  const [familyIncome, setFamilyIncome] = useState("");
  const [selectedAssets,      setSelectedAssets]      = useState<string[]>([]);
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);
  const [insurance,  setInsurance]  = useState<InsuranceState>(initInsurance());
  const [documents,  setDocuments]  = useState<DocumentState>(initDocuments());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Helpers ───────────────────────────────────────────────────
  const toggleAsset = (a: string) =>
    setSelectedAssets((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const toggleInvestment = (i: string) =>
    setSelectedInvestments((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const toggleInsurance = (memberId: string, type: string) =>
    setInsurance((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], [type]: !prev[memberId][type] },
    }));

  const setDocument = (doc: string, value: boolean) =>
    setDocuments((prev) => ({
      ...prev,
      [doc]: prev[doc] === value ? null : value, // clicking same option deselects
    }));

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!selfIncome)   e.selfIncome   = "Please select your income slab";
    if (!familyIncome) e.familyIncome = "Please select family income slab";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveDraft = () => toast.success("Draft saved successfully!");

  const handleNext = () => {
    if (validate()) {
      toast.success("Economic details saved!");
      router.push("/dashboard/profile/review-submit");
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push("/dashboard/profile")} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-semibold text-foreground">Economic Details</h1>
        <p className="text-muted-foreground mt-1">
          Step 6 of 7 — Financial and asset information
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={5} />

      {/* ── 1. Income ── */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Annual Income</CardTitle>
          <CardDescription>Select the applicable income range</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Self Income <span className="text-destructive">*</span></Label>
            <Select value={selfIncome} onValueChange={(v) => { setSelfIncome(v); setErrors({ ...errors, selfIncome: "" }); }}>
              <SelectTrigger className={errors.selfIncome ? "border-destructive" : ""}>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                {incomeSlabs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.selfIncome && <p className="text-xs text-destructive">{errors.selfIncome}</p>}
          </div>

          <div className="space-y-2">
            <Label>Family Income <span className="text-destructive">*</span></Label>
            <Select value={familyIncome} onValueChange={(v) => { setFamilyIncome(v); setErrors({ ...errors, familyIncome: "" }); }}>
              <SelectTrigger className={errors.familyIncome ? "border-destructive" : ""}>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                {incomeSlabs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.familyIncome && <p className="text-xs text-destructive">{errors.familyIncome}</p>}
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Assets ── */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Family Assets</CardTitle>
          <CardDescription>Select all that apply to your family</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {assets.map((asset) => (
              <div
                key={asset}
                onClick={() => toggleAsset(asset)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAssets.includes(asset)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Checkbox
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => toggleAsset(asset)}
                />
                <Label className="font-normal cursor-pointer text-sm">{asset}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Insurance — per family member ── */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Insurance Coverage</CardTitle>
          <CardDescription>
            Select which insurance types each family member has
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">

          {/* Table header */}
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "1fr repeat(3, minmax(100px,1fr))" }}>
            <div /> {/* empty left column */}
            {insuranceTypes.map((t) => (
              <p key={t} className="text-xs font-semibold text-center text-muted-foreground px-1">{t}</p>
            ))}
          </div>

          {/* One row per member */}
          {familyMembers.map((member, index) => (
            <div
              key={member.id}
              className={`grid items-center gap-2 py-3 px-2 rounded-lg ${index % 2 === 0 ? "bg-muted/30" : ""}`}
              style={{ gridTemplateColumns: "1fr repeat(3, minmax(100px,1fr))" }}
            >
              {/* Member name */}
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.relation}</p>
                </div>
              </div>

              {/* Checkbox per insurance type */}
              {insuranceTypes.map((type) => (
                <div key={type} className="flex justify-center">
                  <Checkbox
                    checked={insurance[member.id][type]}
                    onCheckedChange={() => toggleInsurance(member.id, type)}
                    className="h-5 w-5"
                  />
                </div>
              ))}
            </div>
          ))}

        </CardContent>
      </Card>

      {/* ── 4. Documents — Yes / No ── */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Document Status</CardTitle>
          <CardDescription>
            Does your family have these documents? Select Yes or No for each.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {documentTypes.map((doc) => (
            <div
              key={doc}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
            >
              <p className="text-sm font-medium">{doc}</p>

              <div className="flex gap-2">
                {/* YES */}
                <button
                  type="button"
                  onClick={() => setDocument(doc, true)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    documents[doc] === true
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-white border-border text-muted-foreground hover:border-green-400"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Yes
                </button>

                {/* NO */}
                <button
                  type="button"
                  onClick={() => setDocument(doc, false)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    documents[doc] === false
                      ? "bg-red-50 border-red-400 text-red-600"
                      : "bg-white border-border text-muted-foreground hover:border-red-300"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  No
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── 5. Investments ── */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>Select all investment types that apply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {investments.map((inv) => (
              <div
                key={inv}
                onClick={() => toggleInvestment(inv)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedInvestments.includes(inv)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Checkbox
                  checked={selectedInvestments.includes(inv)}
                  onCheckedChange={() => toggleInvestment(inv)}
                />
                <Label className="font-normal cursor-pointer text-sm">{inv}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button variant="outline" onClick={() => router.push("/dashboard/profile/education-profession")} className="gap-2">
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