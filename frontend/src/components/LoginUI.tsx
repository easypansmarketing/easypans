import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

interface LoginUIProps {
  isLogin: boolean;
  step: "form" | "otp";
  email: string;
  password: string;
  username: string;
  phone: string;
  otp: string;
  error: string;

  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setUsername: (v: string) => void;
  setPhone: (v: string) => void;
  setOtp: (v: string) => void;
  setIsLogin: (v: boolean) => void;
  setError: (v: string) => void;

  handleSubmit: (e: React.FormEvent) => void;
  handleVerifyOtp: () => void;
  handleGoogleSignIn: () => void;
  navigate: (path: string) => void;
}

const LoginUI = ({
  isLogin,
  step,
  email,
  password,
  username,
  phone,
  otp,
  error,
  setEmail,
  setPassword,
  setUsername,
  setPhone,
  setOtp,
  setIsLogin,
  setError,
  handleSubmit,
  handleVerifyOtp,
  handleGoogleSignIn,
  navigate,
}: LoginUIProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-lime-100/50 pointer-events-none" />

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
          </CardHeader>

          <CardContent>
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && step === "form" && (
                  <>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={email}
                    disabled={step === "otp"}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {step === "form" && (
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {step === "otp" && (
                  <div>
                    <Label>Enter OTP</Label>
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                {step === "form" ? (
                  <Button type="submit" className="w-full">
                    {isLogin ? "Login" : "Sign Up"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-emerald-600"
                  >
                    Verify OTP
                  </Button>
                )}
              </form>

              {step === "form" && (
                <>
                  <div className="my-4 text-center text-xs uppercase text-muted-foreground">
                    Or
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full"
                    id="google-signin-button"
                  >
                    Sign {isLogin ? "in" : "up"} with Google
                  </Button>

                  <div className="text-center text-sm mt-4">
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => navigate("/reset-password")}
                        className="text-emerald-600 hover:underline block w-full"
                      >
                        Forgot Password?
                      </button>
                    )}

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
                </>
              )}
            </>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LoginUI;
