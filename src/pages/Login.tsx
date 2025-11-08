const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// --- FIXED: Use '@/' path aliases ---
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
// --- END FIX ---

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(""); // --- ADDED: Phone state ---
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- ADDED: Client-side email validation ---
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email ID. Please enter a valid email.");
      return; // Stop the submission
    }
    // --- END: Client-side email validation ---

    const url = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    // --- UPDATED: Add phone to register body ---
    const body = isLogin ? { email, password } : { username, email, password, phone };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isLogin ? 'log in' : 'sign up'}`);
      }
      
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Success!",
        description: isLogin ? "You have successfully logged in." : "Your account has been created.",
      });

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/recipes');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-100 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{isLogin ? "Login" : "Sign Up"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  
                  {/* --- ADDED: Phone Input Field --- */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;