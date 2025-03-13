
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">BeautySkin</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Premium skincare services tailored to your unique needs and goals.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Facial Treatments
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Anti-Aging Care
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Acne Treatments
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chemical Peels
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  View All Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/specialists" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Our Specialists
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Skin Quiz
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Skincare Journal
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Subscribe</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Sign up for skincare tips and exclusive offers.
            </p>
            <div className="flex">
              <Input 
                placeholder="Your email" 
                className="rounded-r-none border-gray-300 focus:border-gray-800 focus:ring-gray-800" 
              />
              <Button className="rounded-l-none bg-gray-900 hover:bg-black">
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BeautySkin. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
