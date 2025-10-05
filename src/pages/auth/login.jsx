import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    dispatch(loginUser(formData)).then((data) => {
      setIsLoading(false);
      if (data?.payload?.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to your account.",
        });
        // Redirect to home page after successful login
        setTimeout(() => {
          navigate("/shop/home");
        }, 1000);
      } else {
        toast({
          title: "Login failed",
          description: data?.payload?.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 animate-fade-in-up">
      <Card className="shadow-xl border-0 rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your account to continue shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 py-5 rounded-lg"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 py-5 rounded-lg"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFormData({
                    email: "user@demo.com",
                    password: "user@121",
                  })
                }
              >
                User Credentials
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFormData({
                    email: "admin@demo.com",
                    password: "admin@121",
                  })
                }
              >
                Admin Credentials
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        <p>© 2024 E-Commerce. All rights reserved.</p>
      </div>
    </div>
  );
}

export default AuthLogin;
