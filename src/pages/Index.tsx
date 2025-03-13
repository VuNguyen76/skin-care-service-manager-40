
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative">
        <div className="w-full h-[80vh] bg-gradient-to-r from-gray-50 to-gray-100 flex items-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
                  Khám phá hành trình <span className="font-medium">chăm sóc da</span> hoàn hảo
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Các phương pháp điều trị da chuyên nghiệp và tư vấn cá nhân hóa
                  phù hợp với nhu cầu làn da độc đáo của bạn.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                    <Link to="/services">Khám phá dịch vụ</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-black text-black hover:bg-gray-100 px-8">
                    <Link to="/quiz" className="flex items-center">
                      Kiểm tra làn da <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="BeautySkin chăm sóc da"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Dịch vụ nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Các phương pháp điều trị chuyên nghiệp của chúng tôi được thiết kế để giải quyết các vấn đề về da cụ thể và giúp bạn đạt được mục tiêu chăm sóc da.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group">
              <div className="aspect-square bg-gray-50 mb-4 overflow-hidden shadow-sm rounded-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Chăm sóc da cơ bản"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Chăm sóc da cơ bản</h3>
              <p className="text-gray-600 mb-4">Liệu pháp làm sạch sâu để thanh lọc và làm mới làn da của bạn.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Tìm hiểu thêm <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Service 2 */}
            <div className="group">
              <div className="aspect-square bg-gray-50 mb-4 overflow-hidden shadow-sm rounded-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Điều trị chống lão hóa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Điều trị chống lão hóa</h3>
              <p className="text-gray-600 mb-4">Phương pháp tiên tiến giúp giảm thiểu nếp nhăn và phục hồi độ đàn hồi cho da.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Tìm hiểu thêm <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Service 3 */}
            <div className="group">
              <div className="aspect-square bg-gray-50 mb-4 overflow-hidden shadow-sm rounded-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Tẩy tế bào chết hóa học"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Tẩy tế bào chết hóa học</h3>
              <p className="text-gray-600 mb-4">Phương pháp tẩy da chết giúp làn da sáng hơn, mịn màng hơn.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Tìm hiểu thêm <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 px-8">
              <Link to="/services">Xem tất cả dịch vụ</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Tư vấn chăm sóc da"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-light">Tư vấn da trực tuyến</h2>
              <p className="text-gray-600">
                Bạn chưa chắc chắn về phương pháp điều trị nào phù hợp với mình? Hãy thực hiện bài kiểm tra da cá nhân hoặc đặt lịch tư vấn trực tuyến với chuyên gia của chúng tôi.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="bg-black hover:bg-gray-800 text-white">
                  <Link to="/quiz">Kiểm tra làn da</Link>
                </Button>
                <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100">
                  <Link to="/specialists">Gặp chuyên gia của chúng tôi</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
