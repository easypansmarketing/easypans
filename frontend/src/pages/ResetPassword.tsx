import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import logo from "@/assets/logo.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"email" | "reset">("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- SEND OTP ----------------
  const handleSendOtp = async () => {
    setError("");

    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({
        title: "OTP Sent",
        description: "Check your email for reset OTP",
      });

      setStep("reset");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async () => {
    setError("");

    if (!otp || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({
        title: "Success",
        description: "Password reset successfully",
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
        <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <img src={logo} alt="EasyPans" className="h-12 w-28 mx-auto" />

            <CardTitle className="text-2xl font-semibold">
              {step === "email"
                ? "Reset your password"
                : "Enter OTP & New Password"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STEP 1 - EMAIL */}
            {step === "email" && (
              <>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full"
                >
                  Send OTP
                </Button>
              </>
            )}

            {/* STEP 2 - OTP + NEW PASSWORD */}
            {step === "reset" && (
              <>
                <div>
                  <Label>OTP</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>

                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full"
                >
                  Reset Password
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
