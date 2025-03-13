
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import authService from "@/services/authService";
import MainLayout from "@/components/layout/MainLayout";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login(formData);
      toast.success("Login successful!");
      
      // Redirect based on user role
      const user = authService.getCurrentUser();
      if (user?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (type: "admin" | "user") => {
    const accounts = authService.getTestAccounts();
    const account = accounts[type];
    setFormData({
      username: account.username,
      password: account.password
    });
    
    // For quick testing, simulate the login directly
    authService.simulateLogin(type);
    toast.success(`Logged in as test ${type}`);
    
    if (type === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl font-light text-center">Sign In</CardTitle>
            <p className="text-center text-gray-500 mt-2">Enter your credentials to access your account</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500 mb-3">
                  For testing purposes, you can use:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleTestLogin("admin")}
                    className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    Login as Admin
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleTestLogin("user")}
                    className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    Login as User
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Create an account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
