"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  GraduationCap,
  Users,
  Wallet,
  FileText,
  Edit,
  CheckCircle2,
} from "lucide-react";

// Mock data — replace with real data from API/state later
const profileData = {
  name: "Rajesh Kumar Sharma",
  initials: "RK",
  completionPercentage: 29,
  personal: {
    fullName: "Rajesh Kumar Sharma",
    email: "rajesh.sharma@example.com",
    phone: "9876543210",
    dateOfBirth: "15 Mar 1990",
    gender: "Male",
    maritalStatus: "Married",
    spouseName: "Priya Sharma",
  },
  religious: {
    gotra: "Kashyap",
    pravara: "Kashyap-Avatsara-Naidhruva",
    upanama: "Kaushik",
    kuladevata: "Kalika Devi",
    surname: "Sharma",
    priestName: "Pt. Ramesh Joshi",
  },
  family: null,
  location: null,
  education: null,
  economic: null,
};

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="font-semibold text-foreground text-sm">
        {value || <span className="text-muted-foreground font-normal italic">Not provided</span>}
      </p>
    </div>
  );
}

function Section({
  title,
  href,
  filled,
  children,
}: {
  title: string;
  href: string;
  filled: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(href)}
          className="gap-1.5 text-primary hover:text-primary"
        >
          <Edit className="h-3.5 w-3.5" />
          {filled ? "Edit" : "Fill"}
        </Button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <p className="text-sm text-muted-foreground italic">
      {label} not filled yet.
    </p>
  );
}

export default function Page() {
  const router = useRouter();
  const p = profileData;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">

      {/* ── Top header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
        <Button
          onClick={() => router.push("/dashboard/profile/personal-details")}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* ── Avatar + completion ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm px-6 py-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary">{p.initials}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg text-foreground">{p.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-muted rounded-full max-w-[160px]">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{ width: `${p.completionPercentage}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {p.completionPercentage}% profile completed
            </span>
          </div>
        </div>
        {p.completionPercentage === 100 && (
          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      {/* ── Basic Information ── */}
      <Section title="Basic Information" href="/dashboard/profile/personal-details" filled={true}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoField icon={User}     label="Full Name"      value={p.personal.fullName} />
          <InfoField icon={Mail}     label="Email"          value={p.personal.email} />
          <InfoField icon={Phone}    label="Phone Number"   value={p.personal.phone} />
          <InfoField icon={Calendar} label="Date of Birth"  value={p.personal.dateOfBirth} />
          <InfoField icon={User}     label="Gender"         value={p.personal.gender} />
          <InfoField icon={Users}    label="Marital Status" value={p.personal.maritalStatus} />
          {p.personal.maritalStatus === "Married" && (
            <InfoField icon={User}   label="Spouse Name"    value={p.personal.spouseName} />
          )}
        </div>
      </Section>

      {/* ── Religious Details ── */}
      <Section title="Religious Details" href="/dashboard/profile/religious-details" filled={true}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoField icon={FileText} label="Gotra"       value={p.religious.gotra} />
          <InfoField icon={FileText} label="Pravara"     value={p.religious.pravara} />
          <InfoField icon={FileText} label="Upanama"     value={p.religious.upanama} />
          <InfoField icon={FileText} label="Kuladevata"  value={p.religious.kuladevata} />
          <InfoField icon={User}     label="Surname"     value={p.religious.surname} />
          <InfoField icon={User}     label="Family Priest" value={p.religious.priestName} />
        </div>
      </Section>

      {/* ── Family Information ── */}
      <Section title="Family Information" href="/dashboard/profile/family-information" filled={false}>
        {p.family ? (
          <p>Family data here</p>
        ) : (
          <EmptySection label="Family information" />
        )}
      </Section>

      {/* ── Location ── */}
      <Section title="Location" href="/dashboard/profile/location-information" filled={false}>
        {p.location ? (
          <p>Location data here</p>
        ) : (
          <EmptySection label="Location information" />
        )}
      </Section>

      {/* ── Education & Profession ── */}
      <Section title="Education & Profession" href="/dashboard/profile/education-profession" filled={false}>
        {p.education ? (
          <p>Education data here</p>
        ) : (
          <EmptySection label="Education & profession details" />
        )}
      </Section>

      {/* ── Economic Details ── */}
      <Section title="Economic Details" href="/dashboard/profile/economic-details" filled={false}>
        {p.economic ? (
          <p>Economic data here</p>
        ) : (
          <EmptySection label="Economic details" />
        )}
      </Section>

    </div>
  );
}