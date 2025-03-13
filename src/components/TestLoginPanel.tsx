
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
        <CardTitle>Đăng nhập thử nghiệm</CardTitle>
        <CardDescription>Sử dụng các tài khoản này để kiểm thử ứng dụng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium">Đã đăng nhập với tài khoản:</p>
            <p>Tên người dùng: {currentUser?.username}</p>
            <p>Vai trò: {currentUser?.roles?.join(", ")}</p>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p>Chưa đăng nhập. Vui lòng chọn tài khoản thử nghiệm bên dưới.</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-md">
            <h3 className="font-semibold">Tài khoản quản trị</h3>
            <p className="text-sm">Tên đăng nhập: admin</p>
            <p className="text-sm">Mật khẩu: admin123</p>
          </div>
          <div className="p-3 border rounded-md">
            <h3 className="font-semibold">Tài khoản người dùng</h3>
            <p className="text-sm">Tên đăng nhập: user</p>
            <p className="text-sm">Mật khẩu: user123</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isLoggedIn ? (
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Đăng xuất
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={() => handleLogin("admin")}>
              Đăng nhập quản trị
            </Button>
            <Button onClick={() => handleLogin("user")}>
              Đăng nhập người dùng
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TestLoginPanel;
