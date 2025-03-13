
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data - this would come from an API
const mockSpecialists = [
  {
    id: 1,
    user: {
      fullName: "Dr. Emma Wilson",
      avatar: ""
    },
    specialization: "Dermatology",
    experience: "10+ years",
    bio: "Dr. Wilson is a board-certified dermatologist specializing in cosmetic treatments and skincare therapy.",
    certifications: "Board Certified in Dermatology, American Academy of Dermatology",
    ratingAverage: 4.9,
    ratingCount: 127,
    services: [1, 2, 3]
  },
  {
    id: 2,
    user: {
      fullName: "Sarah Johnson",
      avatar: ""
    },
    specialization: "Esthetician",
    experience: "8 years",
    bio: "Sarah is a licensed esthetician with expertise in acne treatments and chemical peels.",
    certifications: "Licensed Esthetician, Advanced Chemical Peel Certification",
    ratingAverage: 4.7,
    ratingCount: 95,
    services: [1, 4, 5]
  },
  {
    id: 3,
    user: {
      fullName: "Michael Chang",
      avatar: ""
    },
    specialization: "Cosmetic Therapist",
    experience: "12 years",
    bio: "Michael specializes in anti-aging treatments and has trained aestheticians nationwide.",
    certifications: "Master Aesthetician, Medical Aesthetics Specialist",
    ratingAverage: 4.8,
    ratingCount: 156,
    services: [3, 5, 6]
  },
  {
    id: 4,
    user: {
      fullName: "Jessica Rivera",
      avatar: ""
    },
    specialization: "Medical Esthetician",
    experience: "6 years",
    bio: "Jessica focuses on combining natural skincare methods with advanced technology for optimal results.",
    certifications: "Medical Aesthetician, Laser Therapy Certified",
    ratingAverage: 4.6,
    ratingCount: 78,
    services: [2, 3, 4]
  }
];

const SpecialistsPage = () => {
  const [specialists, setSpecialists] = useState(mockSpecialists);
  const [sortOption, setSortOption] = useState("rating");

  const sortedSpecialists = [...specialists].sort((a, b) => {
    if (sortOption === "rating") {
      return b.ratingAverage - a.ratingAverage;
    } else if (sortOption === "experience") {
      return parseInt(b.experience) - parseInt(a.experience);
    }
    return 0;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Specialists
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Meet our team of experienced skincare professionals
          </p>
        </div>

        {/* Sorting options */}
        <div className="mb-8 flex justify-end">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md text-gray-700 py-1 px-3"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Specialists grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedSpecialists.map(specialist => (
            <Card key={specialist.id}>
              <div className="p-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-600">
                  {specialist.user.fullName.charAt(0)}
                </div>
              </div>
              <CardHeader className="pb-0 text-center">
                <CardTitle>{specialist.user.fullName}</CardTitle>
                <CardDescription className="text-purple-600">
                  {specialist.specialization}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(specialist.ratingAverage) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {specialist.ratingAverage} ({specialist.ratingCount} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 mb-3">Experience: {specialist.experience}</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{specialist.bio}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link to={`/specialists/${specialist.id}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
                <Link to={`/book-specialist/${specialist.id}`} className="ml-2">
                  <Button>Book Appointment</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SpecialistsPage;
