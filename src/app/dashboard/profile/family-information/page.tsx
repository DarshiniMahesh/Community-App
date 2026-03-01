"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, Upload } from "lucide-react";
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

interface FamilyMember {
  id: string;
  relation: string;
  name: string;
  age: string;
  gender: string;
  status: string;
  photo: File | null;
}

const relations = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Other",
];

export default function Page() {
  const router = useRouter();
  const [familyType, setFamilyType] = useState<string>("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      relation: "",
      name: "",
      age: "",
      gender: "",
      status: "active",
      photo: null,
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      relation: "",
      name: "",
      age: "",
      gender: "",
      status: "active",
      photo: null,
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((member) => member.id !== id));
    }
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleFileChange = (id: string, file: File | null) => {
    updateFamilyMember(id, "photo", file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!familyType) {
      newErrors.familyType = "Please select family type";
    }

    familyMembers.forEach((member, index) => {
      if (!member.relation) {
        newErrors[`relation_${index}`] = "Required";
      }
      if (!member.name.trim()) {
        newErrors[`name_${index}`] = "Required";
      }
      if (!member.age) {
        newErrors[`age_${index}`] = "Required";
      }
      if (!member.gender) {
        newErrors[`gender_${index}`] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Family information saved!");
      router.push("/dashboard/profile/location-information");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/profile/religious-details");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
        <h1 className="text-3xl font-semibold text-foreground">Family Information</h1>
        <p className="text-muted-foreground mt-1">
          Step 3 of 7: Add details about your family members
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={2} />

      {/* Family Type */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Family Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>
              Type of Family <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={familyType}
              onValueChange={(value) => {
                setFamilyType(value);
                setErrors({ ...errors, familyType: "" });
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nuclear" id="nuclear" />
                <Label htmlFor="nuclear" className="font-normal cursor-pointer">
                  Nuclear Family
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="joint" id="joint" />
                <Label htmlFor="joint" className="font-normal cursor-pointer">
                  Joint Family
                </Label>
              </div>
            </RadioGroup>
            {errors.familyType && (
              <p className="text-xs text-destructive">{errors.familyType}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family Members Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Family Members</CardTitle>
            <Button onClick={addFamilyMember} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Relation</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[100px]">Age</TableHead>
                    <TableHead className="w-[120px]">Gender</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[200px]">Photo</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Select
                          value={member.relation}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "relation", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors[`relation_${index}`] ? "border-destructive h-9" : "h-9"
                            }
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {relations.map((rel) => (
                              <SelectItem key={rel} value={rel}>
                                {rel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Full name"
                          value={member.name}
                          onChange={(e) =>
                            updateFamilyMember(member.id, "name", e.target.value)
                          }
                          className={
                            errors[`name_${index}`] ? "border-destructive h-9" : "h-9"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={member.age}
                          onChange={(e) =>
                            updateFamilyMember(member.id, "age", e.target.value)
                          }
                          className={
                            errors[`age_${index}`] ? "border-destructive h-9" : "h-9"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.gender}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "gender", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors[`gender_${index}`] ? "border-destructive h-9" : "h-9"
                            }
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.status}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "status", value)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="passed">Passed Away</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(member.id, e.target.files?.[0] || null)
                            }
                            className="h-9 text-xs"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFamilyMember(member.id)}
                          disabled={familyMembers.length === 1}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Click "Add Member" to include more family members. You can add as many as needed.
          </p>
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