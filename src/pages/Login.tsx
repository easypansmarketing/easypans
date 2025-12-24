
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // --- FIXED: Use '@/' path aliases ---
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import logo from "@/assets/logo.png";
// import IngradientBG from "../assets/Ingradient-Background.webp";
// --- END FIX ---

// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [phone, setPhone] = useState(""); // --- ADDED: Phone state ---
//   const [error, setError] = useState("");
//   const [step, setStep] = useState("form"); // "form" | "otp"
// const [otp, setOtp] = useState("");

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

    // --- ADDED: Client-side email validation ---
    // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if (!emailRegex.test(email)) {
    //   setError("Invalid email ID. Please enter a valid email.");
    //   return;  
    // }
    // --- END: Client-side email validation ---

    // const url = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    // --- UPDATED: Add phone to register body ---
    // const body = isLogin ? { email, password } : { username, email, password, phone };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || `Failed to ${isLogin ? 'log in' : 'sign up'}`);
//       }
      
//       toast({
//   title: "Success!",
//   description: isLogin
//     ? "You have successfully logged in."
//     : "OTP sent to your email. Please verify.",
// });

//  // 🔹 LOGIN
//       if (isLogin) {
//         localStorage.setItem("userInfo", JSON.stringify(data));

//         toast({
//           title: "Login successful",
//           description: "Welcome back!",
//         });

//         navigate(data.role === "admin" ? "/admin" : "/recipes");
//       }

      // 🔹 SIGNUP → SHOW OTP
  //     else {
  //       toast({
  //         title: "OTP Sent",
  //         description: "Check your email to verify your account",
  //       });

  //       setStep("otp");
  //     }

  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

   // ---------------- VERIFY OTP ----------------
  // const handleVerifyOtp = async () => {
  //   try {
  //     setError("");

  //     const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, otp }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

  //     localStorage.setItem("userInfo", JSON.stringify(data));

  //     toast({
  //       title: "Verified",
  //       description: "Account verified successfully",
  //     });

  //     navigate("/recipes");
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

  // return (
  //   <div className="min-h-screen flex flex-col">
  //     <Header />
  //      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
  //     <div
  //             className="absolute inset-0  bg-[length:auto_100%] md:bg-[length:120%_100%] bg-top bg-no-repeat opacity-10 pointer-events-none"
  //             style={{ backgroundImage: `url(${IngradientBG})` }}
  //           />
      {/* Decorative background blobs */}
      // <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      // <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />

      // <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-0">
      //   <CardHeader className="text-center space-y-2">
          {/* Brand badge */}
//        <div className="mx-auto flex items-center justify-center  ">
//           <img
//             src={logo}
//             alt="EasyPans"
//             className="h-16 w-28 object-contain"
//           />
//         </div>


//           <CardTitle className="text-2xl font-semibold">
//             {isLogin ? "Welcome back to EasyPans" : "Create your EasyPans account"}
//           </CardTitle>

//           <p className="text-sm text-muted-foreground">
//             {isLogin
//               ? "Login to manage your meals effortlessly"
//               : "Sign up and start ordering smarter"}
//           </p>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <>
//                 <div className="space-y-1">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <div className="space-y-1">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             {error && <p className="text-sm text-red-500">{error}</p>}

//             <Button
//               type="submit"
//               className="w-full rounded-xl bg-gradient-to-r from-emerald-500 hover:opacity-90"
//             >
//               {isLogin ? "Login" : "Sign Up"}
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm">
//             {isLogin ? "New to EasyPans?" : "Already have an account?"}{" "}
//             <button
//               type="button"
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setError("");
//               }}
//               className="font-medium text-emerald-600 hover:underline"
//             >
//               {isLogin ? "Create account" : "Login"}
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </main>

//       <Footer />
//     </div>
//   );
// };

// export default Login;


//updated code
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import logo from "@/assets/logo.png";
import IngradientBG from "../assets/Ingradient-Background.webp";

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

  // ---------------- LOGIN / SIGNUP ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
       <div
                className="absolute inset-0  bg-[length:auto_100%] md:bg-[length:120%_100%] bg-top bg-no-repeat opacity-10 pointer-events-none"
               style={{ backgroundImage: `url(${IngradientBG})` }}
            />

        <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <img src={logo} alt="EasyPans" className="h-12 w-28 mx-auto" />

            <CardTitle className="text-2xl font-semibold">
              {isLogin
                ? "Welcome back to EasyPans"
                : step === "otp"
                ? "Verify your email"
                : "Create your EasyPans account"}
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Login to manage your meals effortlessly"
                : step === "otp"
                ? "Enter the OTP sent to your email"
                : "Sign up and start ordering smarter"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIGNUP EXTRA FIELDS */}
              {!isLogin && step === "form" && (
                <>
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled={step === "otp"}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              {step === "form" && (
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {/* OTP */}
              {step === "otp" && (
                <div>
                  <Label>Enter OTP</Label>
                  <Input
                    value={otp}
                    placeholder="6-digit OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              {step === "form" ? (
                <Button type="submit" className="w-full rounded-xl">
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full rounded-xl bg-emerald-600"
                >
                  Verify OTP
                </Button>
              )}
            </form>

            {step === "form" && (
              <div className="mt-6 text-center text-sm">
                {isLogin ? "New to EasyPans?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="font-medium text-emerald-600 hover:underline"
                >
                  {isLogin ? "Create account" : "Login"}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
