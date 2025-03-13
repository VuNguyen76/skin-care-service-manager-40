
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";

const TestLoginPanel = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  const handleLogin = (accountType: "admin" | "user") => {
    authService.simulateLogin(accountType);
    
    if (accountType === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };
  
  const handleLogout = () => {
    authService.logout();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Authentication</CardTitle>
        <CardDescription>Use these accounts to test the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium">Currently logged in as:</p>
            <p>Username: {currentUser?.username}</p>
            <p>Roles: {currentUser?.roles?.join(", ")}</p>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p>Not logged in. Select a test account below.</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-md">
            <h3 className="font-semibold">Admin Account</h3>
            <p className="text-sm">Username: admin</p>
            <p className="text-sm">Password: admin123</p>
          </div>
          <div className="p-3 border rounded-md">
            <h3 className="font-semibold">User Account</h3>
            <p className="text-sm">Username: user</p>
            <p className="text-sm">Password: user123</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isLoggedIn ? (
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={() => handleLogin("admin")}>
              Login as Admin
            </Button>
            <Button onClick={() => handleLogin("user")}>
              Login as User
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TestLoginPanel;
