"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, User } from "lucide-react";
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

// ── Static data ───────────────────────────────────────────────────
const educationLevels = [
  "Below Primary",
  "Primary School",
  "High School (10th)",
  "Higher Secondary (12th)",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Professional Degree (MBBS / LLB / CA etc.)",
  "Not Applicable",
];

const professionTypes = [
  { label: "Working for Private Firm",     value: "private" },
  { label: "Working for Government / PSU", value: "government" },
  { label: "IAS / IPS / IFS Service",      value: "ias_ips_ifs" },
  { label: "Self Employed / Business",     value: "self_employed" },
];

// All sub-options under Self Employed / Business (as per client Excel)
const selfEmployedOptions = [
  { label: "Own a Small Firm", value: "self_small_firm" },
  { label: "Own a Company",    value: "self_company" },
  { label: "Own a Shop",       value: "self_shop" },
  { label: "Freelancer",       value: "freelancer" },
  { label: "Farmer",           value: "farmer" },
  { label: "Other",            value: "other" },
  { label: "Training",         value: "training" },
];

const languageOptions = [
  "RSB Konkani",
  "GSB Konkani",
  "Kannada",
  "Tulu",
  "Marathi",
  "Hindi",
  "Malayalam",
  "Gujarati",
  "English",
  "Tamil",
  "Telugu",
  "Other",
];

// ── Types ─────────────────────────────────────────────────────────
interface MemberData {
  id: string;
  name: string;
  relation: string;
  highestEducation: string;
  certifications: string[];
  profession: string;
  selfEmployedType: string;    // sub-option when profession = "self_employed"
  selfEmployedOther: string;   // text when selfEmployedType = "other"
  industry: string;
  briefProfile: string;
  languages: string[];
  languageOther: string;       // text when "Other" language selected
}

function blankMember(id: string): MemberData {
  return {
    id,
    name: "",
    relation: "",
    highestEducation: "",
    certifications: [""],
    profession: "",
    selfEmployedType: "",
    selfEmployedOther: "",
    industry: "",
    briefProfile: "",
    languages: [],
    languageOther: "",
  };
}

// ── Page ──────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();

  // Start with one blank member
  const [members, setMembers] = useState<MemberData[]>([blankMember("1")]);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const addMember = () => {
    const newId = Date.now().toString();
    setMembers((prev) => [...prev, blankMember(newId)]);
  };

  const removeMember = (id: string) => {
    if (members.length === 1) return; // keep at least one
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Updaters ──────────────────────────────────────────────────
  const update = (id: string, field: keyof MemberData, value: unknown) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
    setErrors((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: "" } }));
  };

  const toggleLanguage = (id: string, lang: string) => {
    const m = members.find((x) => x.id === id)!;
    const updated = m.languages.includes(lang)
      ? m.languages.filter((l) => l !== lang)
      : [...m.languages, lang];
    update(id, "languages", updated);
  };

  const addCert    = (id: string) => {
    const m = members.find((x) => x.id === id)!;
    update(id, "certifications", [...m.certifications, ""]);
  };
  const editCert   = (id: string, i: number, v: string) => {
    const m = members.find((x) => x.id === id)!;
    const c = [...m.certifications]; c[i] = v;
    update(id, "certifications", c);
  };
  const removeCert = (id: string, i: number) => {
    const m = members.find((x) => x.id === id)!;
    if (m.certifications.length <= 1) return;
    update(id, "certifications", m.certifications.filter((_, ci) => ci !== i));
  };

  const isComplete = (m: MemberData) => !!m.highestEducation && !!m.profession;

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let valid = true;
    members.forEach((m) => {
      const e: Record<string, string> = {};
      if (!m.highestEducation) { e.highestEducation = "Required"; valid = false; }
      if (!m.profession)       { e.profession = "Required"; valid = false; }
      if (m.profession === "self_employed" && !m.selfEmployedType) {
        e.selfEmployedType = "Please select type of business"; valid = false;
      }
      if (m.selfEmployedType === "other" && !m.selfEmployedOther.trim()) {
        e.selfEmployedOther = "Please specify your business"; valid = false;
      }
      if (m.languages.includes("Other") && !m.languageOther.trim()) {
        e.languageOther = "Please specify the language"; valid = false;
      }
      newErrors[m.id] = e;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSaveDraft = () => toast.success("Draft saved successfully!");
  const handleNext = () => {
    if (validate()) {
      toast.success("Education & profession details saved!");
      router.push("/dashboard/profile/economic-details");
    } else {
      toast.error("Please complete required fields for all members");
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
        <h1 className="text-3xl font-semibold text-foreground">Education & Profession</h1>
        <p className="text-muted-foreground mt-1">
          Step 5 of 7 — Fill education and profession details for each family member
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={4} />

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
        <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Fill details for every family member</p>
          <p className="text-sm text-muted-foreground">
            Each member has their own section. Click to expand and fill.
            Highest Education and Profession are required for every member.
          </p>
        </div>
      </div>

      {/* ── Member accordion ── */}
      <Accordion type="multiple" defaultValue={[members[0]?.id]} className="space-y-3">
        {members.map((member, index) => (
          <AccordionItem
            key={member.id}
            value={member.id}
            className="border border-border rounded-xl overflow-hidden shadow-sm bg-white"
          >
            {/* Header row */}
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/20 [&[data-state=open]]:bg-muted/10">
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">
                    {member.name ? member.name : `Member ${index + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.relation || "Relation not set"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`mr-2 ${
                    isComplete(member)
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-orange-50 text-orange-600 border-orange-200"
                  }`}
                >
                  {isComplete(member) ? "✓ Complete" : "Incomplete"}
                </Badge>
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                    className="mr-2 p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </AccordionTrigger>

            {/* Body */}
            <AccordionContent className="px-5 pb-6 pt-4 border-t border-border space-y-6">

              {/* Name + Relation (editable in case user wants to correct) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Member Name</Label>
                  <Input
                    placeholder="Full name"
                    value={member.name}
                    onChange={(e) => update(member.id, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relation to You</Label>
                  <Input
                    placeholder="E.g. Son, Wife, Father"
                    value={member.relation}
                    onChange={(e) => update(member.id, "relation", e.target.value)}
                  />
                </div>
              </div>

              {/* ── Education section ── */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
                  Education
                </p>

                <div className="space-y-2">
                  <Label>
                    Highest Education <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={member.highestEducation}
                    onValueChange={(v) => update(member.id, "highestEducation", v)}
                  >
                    <SelectTrigger className={errors[member.id]?.highestEducation ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select highest qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[member.id]?.highestEducation && (
                    <p className="text-xs text-destructive">{errors[member.id].highestEducation}</p>
                  )}
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Certifications / Additional Qualifications</Label>
                    <Button
                      type="button" variant="outline" size="sm"
                      onClick={() => addCert(member.id)}
                      className="gap-1 h-7 text-xs"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  {member.certifications.map((cert, ci) => (
                    <div key={ci} className="flex gap-2">
                      <Input
                        placeholder={`Certification ${ci + 1}`}
                        value={cert}
                        onChange={(e) => editCert(member.id, ci, e.target.value)}
                      />
                      {member.certifications.length > 1 && (
                        <Button
                          type="button" variant="ghost" size="icon"
                          onClick={() => removeCert(member.id, ci)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Profession section ── */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
                  Profession
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Type of Profession <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={member.profession}
                      onValueChange={(v) => {
                        update(member.id, "profession", v);
                        // clear sub-option when profession changes
                        update(member.id, "selfEmployedType", "");
                      }}
                    >
                      <SelectTrigger className={errors[member.id]?.profession ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionTypes.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[member.id]?.profession && (
                      <p className="text-xs text-destructive">{errors[member.id].profession}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Industry / Field</Label>
                    <Input
                      placeholder="E.g. Software, Banking, Teaching"
                      value={member.industry}
                      onChange={(e) => update(member.id, "industry", e.target.value)}
                    />
                  </div>
                </div>

                {/* Self Employed sub-options — dropdown */}
                {member.profession === "self_employed" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>
                        Type of Business <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={member.selfEmployedType}
                        onValueChange={(v) => {
                          update(member.id, "selfEmployedType", v);
                          update(member.id, "selfEmployedOther", "");
                        }}
                      >
                        <SelectTrigger className={errors[member.id]?.selfEmployedType ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select type of business" />
                        </SelectTrigger>
                        <SelectContent>
                          {selfEmployedOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[member.id]?.selfEmployedType && (
                        <p className="text-xs text-destructive">{errors[member.id].selfEmployedType}</p>
                      )}
                    </div>
                    {/* Other text box */}
                    {member.selfEmployedType === "other" && (
                      <div className="space-y-2">
                        <Label>Please specify <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="Describe your business"
                          value={member.selfEmployedOther}
                          onChange={(e) => update(member.id, "selfEmployedOther", e.target.value)}
                          className={errors[member.id]?.selfEmployedOther ? "border-destructive" : ""}
                        />
                        {errors[member.id]?.selfEmployedOther && (
                          <p className="text-xs text-destructive">{errors[member.id].selfEmployedOther}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    Brief Profile{" "}
                    <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    placeholder="Short note about work or achievements"
                    value={member.briefProfile}
                    onChange={(e) => update(member.id, "briefProfile", e.target.value)}
                  />
                </div>
              </div>

              {/* ── Languages section ── */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
                  Languages Known
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languageOptions.map((lang) => (
                    <div key={lang} className="flex items-center gap-2">
                      <Checkbox
                        id={`${member.id}-${lang}`}
                        checked={member.languages.includes(lang)}
                        onCheckedChange={() => toggleLanguage(member.id, lang)}
                      />
                      <Label
                        htmlFor={`${member.id}-${lang}`}
                        className="font-normal cursor-pointer text-sm"
                      >
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
                {/* Other language text box */}
                {member.languages.includes("Other") && (
                  <div className="space-y-2">
                    <Label>Please specify language <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="Enter language name"
                      value={member.languageOther}
                      onChange={(e) => update(member.id, "languageOther", e.target.value)}
                      className={errors[member.id]?.languageOther ? "border-destructive" : ""}
                    />
                    {errors[member.id]?.languageOther && (
                      <p className="text-xs text-destructive">{errors[member.id].languageOther}</p>
                    )}
                  </div>
                )}
              </div>

            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Member button */}
      <Button
        type="button"
        variant="outline"
        onClick={addMember}
        className="w-full gap-2 border-dashed border-2 border-primary/40 text-primary hover:bg-primary/5 py-6"
      >
        <Plus className="h-5 w-5" />
        Add Another Member
      </Button>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button variant="outline" onClick={() => router.push("/dashboard/profile/location-information")} className="gap-2">
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