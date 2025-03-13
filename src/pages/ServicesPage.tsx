
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { serviceApi, categoryApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch services data
  const { 
    data: services, 
    isLoading: isLoadingServices,
    error: servicesError
  } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll({ active: true })
  });

  // Fetch categories data
  const { 
    data: categories, 
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll()
  });

  const filteredServices = selectedCategory && services
    ? services.filter(service => 
        service.categories?.some(category => category.id === selectedCategory)
      )
    : services;

  // Show loading state
  if (isLoadingServices || isLoadingCategories) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (servicesError || categoriesError) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Không thể tải dữ liệu</h2>
          <p className="mb-6">Đã xảy ra lỗi khi tải thông tin dịch vụ. Vui lòng thử lại sau.</p>
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6">Dịch Vụ Của Chúng Tôi</h1>
            <p className="text-lg text-gray-600 mb-8">
              Khám phá các liệu trình chăm sóc da chuyên nghiệp được thiết kế riêng cho từng vấn đề da
              và giúp bạn đạt được làn da khỏe đẹp mơ ước.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories && categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null 
                ? "bg-primary hover:bg-primary/80 text-white rounded-none" 
                : "text-gray-800 border-gray-300 hover:bg-gray-50 rounded-none"
              }
            >
              Tất Cả Dịch Vụ
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-primary hover:bg-primary/80 text-white rounded-none" 
                  : "text-gray-800 border-gray-300 hover:bg-gray-50 rounded-none"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 mb-8">
            <p className="text-gray-500">Chưa có danh mục dịch vụ.</p>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices && filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div key={service.id} className="group">
                <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition duration-300">
                      Hình ảnh dịch vụ
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium">{service.name}</h3>
                  <div className="text-right">
                    <span className="font-medium text-lg">{service.price?.toLocaleString('vi-VN')} ₫</span>
                    <p className="text-sm text-gray-500">{service.durationMinutes} phút</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {service.categories?.map(category => (
                      <span key={category.id} className="text-xs px-2 py-1 bg-gray-100 text-gray-600">
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to={`/book-service/${service.id}`} 
                    className="text-primary font-medium inline-flex items-center border-b border-primary pb-1 hover:opacity-70"
                  >
                    Đặt Lịch <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-6">Không tìm thấy dịch vụ nào.</p>
            {selectedCategory && (
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Xem tất cả dịch vụ
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Consultation CTA */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Bạn chưa biết nên chọn liệu trình nào?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Làm bài kiểm tra da để nhận gợi ý liệu trình phù hợp hoặc đặt lịch tư vấn trực tiếp với chuyên gia của chúng tôi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/80 text-white rounded-none px-8">
              <Link to="/quiz">Kiểm Tra Da</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-gray-100 rounded-none px-8">
              <Link to="/specialists">Tư Vấn Với Chuyên Gia</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
