
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/services/api";

const Footer = () => {
  const { data: generalSettings } = useQuery({
    queryKey: ["settings", "general"],
    queryFn: () => settingsApi.getGeneralSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const siteName = generalSettings?.siteName || "BeautySkin";
  const siteDescription = generalSettings?.siteDescription || "Premium skincare services tailored to your unique needs and goals.";
  const address = generalSettings?.address || "";
  const contactEmail = generalSettings?.contactEmail || "";
  const contactPhone = generalSettings?.contactPhone || "";

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">{siteName}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {siteDescription}
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
            <h3 className="text-lg font-medium mb-4 text-gray-900">Dịch vụ</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Điều trị da mặt
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chăm sóc chống lão hóa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Điều trị mụn
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tẩy da hóa học
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Xem tất cả dịch vụ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/specialists" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chuyên gia của chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Kiểm tra da
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Nhật ký chăm sóc da
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tài khoản của tôi
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Đặt lịch hẹn
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Liên hệ</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {contactEmail && <div className="mb-2">Email: {contactEmail}</div>}
              {contactPhone && <div className="mb-2">SĐT: {contactPhone}</div>}
              {address && <div className="mb-4">Địa chỉ: {address}</div>}
            </p>
            <div className="flex">
              <Input 
                placeholder="Email của bạn" 
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
              © {new Date().getFullYear()} {siteName}. Tất cả các quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
