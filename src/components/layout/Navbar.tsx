
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ShoppingBag, Search } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/" className="text-sm text-gray-800 hover:text-black">
              Home
            </Link>
            <Link to="/services" className="text-sm text-gray-800 hover:text-black">
              Services
            </Link>
            <Link to="/specialists" className="text-sm text-gray-800 hover:text-black">
              Specialists
            </Link>
            <Link to="/quiz" className="text-sm text-gray-800 hover:text-black">
              Skin Quiz
            </Link>
            <Link to="/blog" className="text-sm text-gray-800 hover:text-black">
              Blog
            </Link>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-800 hover:text-black">
              <Search size={20} />
            </button>
            <Link to="/login" className="text-gray-800 hover:text-black">
              <User size={20} />
            </Link>
            <Link to="/register">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-none">
                Book Now
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
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/specialists"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Specialists
            </Link>
            <Link
              to="/quiz"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Skin Quiz
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-3">
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
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
