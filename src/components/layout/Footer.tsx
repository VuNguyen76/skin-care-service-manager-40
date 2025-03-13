
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BeautySkin</h3>
            <p className="text-gray-600">
              Professional skincare services tailored to your unique needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-purple-600">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/specialists" className="text-gray-600 hover:text-purple-600">
                  Specialists
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-600 hover:text-purple-600">
                  Skin Quiz
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-purple-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-600">123 Beauty Street</p>
            <p className="text-gray-600">Skin City, SC 12345</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
            <p className="text-gray-600">Email: info@beautyskin.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} BeautySkin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
