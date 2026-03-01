"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "../Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, MapPin } from "lucide-react";
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

interface Address {
  flatNo: string;
  building: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

interface OldAddress extends Address {
  id: string;
}

export default function Page() {
  const router = useRouter();

  const [currentAddress, setCurrentAddress] = useState<Address>({
    flatNo: "",
    building: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [hometownAddress, setHometownAddress] = useState<Address>({
    flatNo: "",
    building: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [oldAddresses, setOldAddresses] = useState<OldAddress[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addOldAddress = () => {
    if (oldAddresses.length < 4) {
      setOldAddresses([
        ...oldAddresses,
        {
          id: Date.now().toString(),
          flatNo: "",
          building: "",
          street: "",
          area: "",
          city: "",
          state: "",
          pincode: "",
        },
      ]);
    }
  };

  const removeOldAddress = (id: string) => {
    setOldAddresses(oldAddresses.filter((addr) => addr.id !== id));
  };

  const updateOldAddress = (id: string, field: keyof Address, value: string) => {
    setOldAddresses(
      oldAddresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentAddress.city.trim()) newErrors.currentCity = "City is required";
    if (!currentAddress.state.trim()) newErrors.currentState = "State is required";
    if (!currentAddress.pincode.trim()) newErrors.currentPincode = "Pincode is required";

    if (!hometownAddress.city.trim()) newErrors.hometownCity = "City is required";
    if (!hometownAddress.state.trim()) newErrors.hometownState = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success("Location information saved!");
      router.push("/dashboard/profile/education-profession");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/profile/family-information");
  };

  const renderAddressFields = (
    address: Address,
    setAddress: (addr: Address) => void,
    prefix: string
  ) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}FlatNo`}>Flat/House No.</Label>
        <Input
          id={`${prefix}FlatNo`}
          placeholder="Enter flat/house number"
          value={address.flatNo}
          onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}Building`}>Building/Society</Label>
        <Input
          id={`${prefix}Building`}
          placeholder="Enter building name"
          value={address.building}
          onChange={(e) => setAddress({ ...address, building: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}Street`}>Street/Road</Label>
        <Input
          id={`${prefix}Street`}
          placeholder="Enter street name"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}Area`}>Area/Locality</Label>
        <Input
          id={`${prefix}Area`}
          placeholder="Enter area"
          value={address.area}
          onChange={(e) => setAddress({ ...address, area: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}City`}>
          City <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${prefix}City`}
          placeholder="Enter city"
          value={address.city}
          onChange={(e) => {
            setAddress({ ...address, city: e.target.value });
            setErrors({ ...errors, [`${prefix}City`]: "" });
          }}
          className={errors[`${prefix}City`] ? "border-destructive" : ""}
        />
        {errors[`${prefix}City`] && (
          <p className="text-xs text-destructive">{errors[`${prefix}City`]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}State`}>
          State <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${prefix}State`}
          placeholder="Enter state"
          value={address.state}
          onChange={(e) => {
            setAddress({ ...address, state: e.target.value });
            setErrors({ ...errors, [`${prefix}State`]: "" });
          }}
          className={errors[`${prefix}State`] ? "border-destructive" : ""}
        />
        {errors[`${prefix}State`] && (
          <p className="text-xs text-destructive">{errors[`${prefix}State`]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}Pincode`}>
          Pincode {prefix === "current" && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={`${prefix}Pincode`}
          placeholder="Enter pincode"
          value={address.pincode}
          maxLength={6}
          onChange={(e) => {
            setAddress({ ...address, pincode: e.target.value });
            setErrors({ ...errors, [`${prefix}Pincode`]: "" });
          }}
          className={errors[`${prefix}Pincode`] ? "border-destructive" : ""}
        />
        {errors[`${prefix}Pincode`] && (
          <p className="text-xs text-destructive">{errors[`${prefix}Pincode`]}</p>
        )}
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-semibold text-foreground">Location Information</h1>
        <p className="text-muted-foreground mt-1">
          Step 4 of 7: Provide your address details
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={3} />

      {/* Current Address */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Current Address</CardTitle>
          </div>
          <CardDescription>Your present residential address</CardDescription>
        </CardHeader>
        <CardContent>
          {renderAddressFields(currentAddress, setCurrentAddress, "current")}
        </CardContent>
      </Card>

      {/* Hometown Address */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Home Town Address</CardTitle>
          </div>
          <CardDescription>Your native place or ancestral home</CardDescription>
        </CardHeader>
        <CardContent>
          {renderAddressFields(hometownAddress, setHometownAddress, "hometown")}
        </CardContent>
      </Card>

      {/* Old Location History */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Old Location History</CardTitle>
              <CardDescription>
                Add up to 4 previous addresses (Optional)
              </CardDescription>
            </div>
            <Button
              onClick={addOldAddress}
              size="sm"
              variant="outline"
              disabled={oldAddresses.length >= 4}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Previous Address
            </Button>
          </div>
        </CardHeader>
        {oldAddresses.length > 0 && (
          <CardContent className="space-y-6">
            {oldAddresses.map((address, index) => (
              <div key={address.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Previous Address {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOldAddress(address.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => updateOldAddress(address.id, "city", e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => updateOldAddress(address.id, "state", e.target.value)}
                  />
                  <Input
                    placeholder="Area/Locality"
                    value={address.area}
                    onChange={(e) => updateOldAddress(address.id, "area", e.target.value)}
                  />
                  <Input
                    placeholder="Pincode"
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => updateOldAddress(address.id, "pincode", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        )}
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