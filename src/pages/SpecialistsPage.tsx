
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { specialistApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

const SpecialistsPage = () => {
  const [sortOption, setSortOption] = useState("rating");

  // Fetch specialists data
  const { 
    data: specialists, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['specialists'],
    queryFn: () => specialistApi.getAll()
  });

  const sortedSpecialists = specialists 
    ? [...specialists].sort((a, b) => {
        if (sortOption === "rating") {
          return (b.ratingAverage || 0) - (a.ratingAverage || 0);
        } else if (sortOption === "experience") {
          // Extract years from experience string for sorting
          const getYears = (exp: string) => {
            const match = exp?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          return getYears(b.experience || '') - getYears(a.experience || '');
        }
        return 0;
      })
    : [];

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Không thể tải dữ liệu</h2>
          <p className="mb-6">Đã xảy ra lỗi khi tải thông tin chuyên gia. Vui lòng thử lại sau.</p>
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Đội Ngũ Chuyên Gia
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Gặp gỡ đội ngũ chuyên gia chăm sóc da giàu kinh nghiệm của chúng tôi
          </p>
        </div>

        {/* Sorting options */}
        <div className="mb-8 flex justify-end">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sắp xếp theo:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md text-gray-700 py-1 px-3"
            >
              <option value="rating">Đánh giá cao nhất</option>
              <option value="experience">Kinh nghiệm nhiều nhất</option>
            </select>
          </div>
        </div>

        {/* Specialists grid */}
        {sortedSpecialists && sortedSpecialists.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedSpecialists.map(specialist => (
              <Card key={specialist.id}>
                <div className="p-6 flex justify-center">
                  {specialist.user?.avatar ? (
                    <img 
                      src={specialist.user.avatar} 
                      alt={specialist.user.fullName}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-600">
                      {specialist.user?.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-0 text-center">
                  <CardTitle>{specialist.user?.fullName}</CardTitle>
                  <CardDescription className="text-primary">
                    {specialist.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(specialist.ratingAverage || 0) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        {specialist.ratingAverage?.toFixed(1) || '0.0'} ({specialist.ratingCount || 0} đánh giá)
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-3">Kinh nghiệm: {specialist.experience || 'Chưa cập nhật'}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{specialist.bio || 'Chưa cập nhật thông tin'}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link to={`/specialists/${specialist.id}`}>
                    <Button variant="outline">Xem Chi Tiết</Button>
                  </Link>
                  <Link to={`/book-specialist/${specialist.id}`} className="ml-2">
                    <Button>Đặt Lịch Hẹn</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-6">Hiện chưa có thông tin chuyên gia.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SpecialistsPage;
