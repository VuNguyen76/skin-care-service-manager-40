
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Calendar, LogOut } from "lucide-react";
import authService from "@/services/authService";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm ${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-800 hover:text-primary'}`}>
              Trang chủ
            </Link>
            <Link to="/services" className={`text-sm ${location.pathname === '/services' ? 'text-primary font-medium' : 'text-gray-800 hover:text-primary'}`}>
              Dịch vụ
            </Link>
            <Link to="/specialists" className={`text-sm ${location.pathname === '/specialists' ? 'text-primary font-medium' : 'text-gray-800 hover:text-primary'}`}>
              Chuyên gia
            </Link>
            <Link to="/quiz" className={`text-sm ${location.pathname === '/quiz' ? 'text-primary font-medium' : 'text-gray-800 hover:text-primary'}`}>
              Kiểm tra da
            </Link>
            <Link to="/blogs" className={`text-sm ${location.pathname === '/blogs' ? 'text-primary font-medium' : 'text-gray-800 hover:text-primary'}`}>
              Bài viết
            </Link>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-gray-800 hover:text-primary">
                    <User size={20} />
                    <span className="text-sm font-medium">
                      {currentUser?.username || "Tài khoản"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">Hồ sơ cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings">Lịch hẹn của tôi</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Quản trị viên</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-gray-800 hover:text-primary">
                <User size={20} />
                <span className="text-sm font-medium">Đăng nhập</span>
              </Link>
            )}
            
            <Link to="/booking">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Đặt lịch ngay
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/services"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/services' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              to="/specialists"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/specialists' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chuyên gia
            </Link>
            <Link
              to="/quiz"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/quiz' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kiểm tra da
            </Link>
            <Link
              to="/blogs"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/blogs' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Bài viết
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-bookings"
                  className={`block px-3 py-2 text-base font-medium ${location.pathname === '/my-bookings' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lịch hẹn của tôi
                </Link>
                <Link
                  to="/account"
                  className={`block px-3 py-2 text-base font-medium ${location.pathname === '/account' ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 text-base font-medium ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Quản trị
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile account section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-800 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-800 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="text-base font-medium">
                        {currentUser?.username || "Người dùng"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-red-500"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                )}
              </div>
              
              <div className="mt-3">
                <Link
                  to="/booking"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Đặt lịch ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
