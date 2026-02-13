const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import logo from "@/assets/logo.png";
import LoginUI from "../components/LoginUI";

declare global {
  interface Window {
    google: any;
  }
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    }
  }, []);

  // Handle Google Sign-In response
  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login successful",
        description: "Welcome to EasyPans!",
      });
      navigate(data.role === "admin" ? "/admin" : "/recipes");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (exactly 10 digits)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Google Sign-In
  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large", width: "100%" },
      );
    } else {
      console.error("Google Sign-In not loaded");
      setError("Google Sign-In not available. Please try again.");
    }
  };

  // ---------------- LOGIN / SIGNUP ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone for signup
    if (!isLogin && !validatePhone(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    const url = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    const body = isLogin
      ? { email, password }
      : { username, email, password, phone };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔹 LOGIN FLOW (admin + user)
      if (isLogin) {
        localStorage.setItem("userInfo", JSON.stringify(data));

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        navigate(data.role === "admin" ? "/admin" : "/recipes");
        return;
      }

      // 🔹 SIGNUP FLOW → SHOW OTP
      toast({
        title: "OTP Sent",
        description: "Check your email to verify your account",
      });

      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async () => {
    try {
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Verified",
        description: "Account verified successfully",
      });

      navigate("/recipes");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <LoginUI
      isLogin={isLogin}
      step={step}
      email={email}
      password={password}
      username={username}
      phone={phone}
      otp={otp}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      setUsername={setUsername}
      setPhone={setPhone}
      setOtp={setOtp}
      setIsLogin={setIsLogin}
      setError={setError}
      handleSubmit={handleSubmit}
      handleVerifyOtp={handleVerifyOtp}
      handleGoogleSignIn={handleGoogleSignIn}
      navigate={navigate}
    />
  );
};

export default Login;
