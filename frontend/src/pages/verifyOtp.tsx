// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const email = location.state?.email;

//   const handleVerify = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       localStorage.setItem("userInfo", JSON.stringify(data));
//       navigate("/recipes");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (!email) return <p>Invalid access</p>;

//   return (
//     <div>
//       <h2>Verify OTP</h2>
//       <input value={otp} onChange={(e) => setOtp(e.target.value)} />
//       <button onClick={handleVerify}>Verify</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default VerifyOtp;



import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async () => {
    if (!otp) return setError("Please enter OTP");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/recipes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <p className="text-center mt-20 text-red-500">
        Invalid access. Please sign up again.
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
    <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
       <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-lime-100/50 pointer-events-none"
            />

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto">
            <img src={logo} alt="EasyPans" className="h-16 w-28 mx-auto" />
          </div>

          <CardTitle className="text-2xl font-semibold">
            Verify Your Email
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            OTP sent to <b>{email}</b>
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 hover:opacity-90"
          >
            Verify OTP
          </Button>
        </CardContent>
      </Card>
    </main>
     <Footer />
    </div>
  );
};

export default VerifyOtp;
