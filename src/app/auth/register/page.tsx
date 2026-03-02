"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Users, Lock, Mail, Phone, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.identifier) {
      newErrors.identifier = loginType === "email" ? "Email is required" : "Phone number is required";
    } else if (loginType === "email" && !formData.identifier.includes("@")) {
      newErrors.identifier = "Please enter a valid email address";
    } else if (loginType === "phone" && formData.identifier.length !== 10) {
      newErrors.identifier = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show OTP dialog
    setShowOTPDialog(true);

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otpValue.length === 6) {
      setShowOTPDialog(false);
      router.push("/dashboard");
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      setOtpValue("");
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <>
      {/* ✅ Centering wrapper taken from old code */}
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-xl border-border">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Register for Community Portal access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Type Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType("email")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    loginType === "email"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    loginType === "phone"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
              </div>

              {/* Email/Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {loginType === "email" ? "Email Address" : "Phone Number"}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {loginType === "email" ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                  </div>
                  <Input
                    id="identifier"
                    type={loginType === "email" ? "email" : "tel"}
                    placeholder={loginType === "email" ? "name@example.com" : "1234567890"}
                    value={formData.identifier}
                    onChange={(e) => {
                      setFormData({ ...formData, identifier: e.target.value });
                      setErrors({ ...errors, identifier: "" });
                    }}
                    className={`pl-10 bg-input-background ${errors.identifier ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-destructive">{errors.identifier}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    className={`pl-10 pr-10 bg-input-background ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <Progress value={passwordStrength} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">
                      Password strength:{" "}
                      {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`pl-10 pr-10 bg-input-background ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Verify Your {loginType === "email" ? "Email" : "Phone"}
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a 6-digit code to <br />
              <span className="font-medium text-foreground">{formData.identifier}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {resendTimer} seconds
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={otpValue.length !== 6}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verify & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
