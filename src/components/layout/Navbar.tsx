
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Calendar, Search } from "lucide-react";
import authService from "@/services/authService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-light tracking-tight text-black">
                BeautySkin
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm ${location.pathname === '/' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'}`}>
              Trang chủ
            </Link>
            <Link to="/services" className={`text-sm ${location.pathname === '/services' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'}`}>
              Dịch vụ
            </Link>
            <Link to="/specialists" className={`text-sm ${location.pathname === '/specialists' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'}`}>
              Chuyên gia
            </Link>
            <Link to="/quiz" className={`text-sm ${location.pathname === '/quiz' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'}`}>
              Kiểm tra da
            </Link>
            <Link to="/blogs" className={`text-sm ${location.pathname === '/blogs' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'}`}>
              Bài viết
            </Link>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-800 hover:text-black">
              <Search size={20} />
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-gray-800 hover:text-black">
                  <Calendar size={20} />
                </Link>
                <Link to="/account" className="text-gray-800 hover:text-black">
                  <User size={20} />
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                      Quản trị
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-black">
                <User size={20} />
              </Link>
            )}
            <Link to="/booking">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-none">
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
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/services"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/services' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              to="/specialists"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/specialists' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chuyên gia
            </Link>
            <Link
              to="/quiz"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/quiz' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kiểm tra da
            </Link>
            <Link
              to="/blogs"
              className={`block px-3 py-2 text-base font-medium ${location.pathname === '/blogs' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Bài viết
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-bookings"
                  className={`block px-3 py-2 text-base font-medium ${location.pathname === '/my-bookings' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lịch hẹn của tôi
                </Link>
                <Link
                  to="/account"
                  className={`block px-3 py-2 text-base font-medium ${location.pathname === '/account' ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 text-base font-medium ${location.pathname.startsWith('/admin') ? 'text-black' : 'text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Quản trị
                  </Link>
                )}
              </>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-800 hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-800 hover:text-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/booking"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      Đặt lịch ngay
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
