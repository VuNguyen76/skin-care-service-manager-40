
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-4">BeautySkin</h3>
            <p className="text-gray-600 mb-4">
              Professional skincare services tailored to your unique needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black">
                  Facial Treatments
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black">
                  Anti-Aging Care
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black">
                  Acne Treatments
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black">
                  Chemical Peels
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black">
                  View All Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/specialists" className="text-gray-600 hover:text-black">
                  Our Specialists
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-600 hover:text-black">
                  Skin Quiz
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-black">
                  Skincare Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-black">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/book-service" className="text-gray-600 hover:text-black">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Subscribe</h3>
            <p className="text-gray-600 mb-4">
              Sign up for skincare tips and special offers.
            </p>
            <div className="flex">
              <Input 
                placeholder="Your email" 
                className="rounded-r-none border-gray-300 focus:border-black focus:ring-black" 
              />
              <Button className="rounded-l-none bg-black hover:bg-gray-800">
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BeautySkin. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-600">
              <a href="#" className="hover:text-black">Privacy Policy</a>
              <a href="#" className="hover:text-black">Terms of Service</a>
              <a href="#" className="hover:text-black">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
