
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Mock data - this would come from an API
const mockServices = [
  {
    id: 1,
    name: "Classic Facial",
    description: "A deep cleansing facial that includes extraction to remove impurities and clear congested pores.",
    price: 85.00,
    durationMinutes: 60,
    imageUrl: "",
    categories: [{ id: 1, name: "Facial Treatments" }]
  },
  {
    id: 2,
    name: "Hydrating Facial",
    description: "Designed to replenish moisture and restore balance to dry or dehydrated skin.",
    price: 95.00,
    durationMinutes: 60,
    imageUrl: "",
    categories: [{ id: 1, name: "Facial Treatments" }]
  },
  {
    id: 3,
    name: "Anti-Aging Treatment",
    description: "Targets fine lines and wrinkles using advanced ingredients that stimulate collagen production.",
    price: 120.00,
    durationMinutes: 75,
    imageUrl: "",
    categories: [{ id: 1, name: "Facial Treatments" }, { id: 2, name: "Anti-Aging" }]
  },
  {
    id: 4,
    name: "Acne Treatment",
    description: "Specifically formulated for problematic and acne-prone skin types.",
    price: 90.00,
    durationMinutes: 60,
    imageUrl: "",
    categories: [{ id: 1, name: "Facial Treatments" }, { id: 3, name: "Acne Care" }]
  },
  {
    id: 5,
    name: "Chemical Peel",
    description: "Exfoliating treatment that reveals brighter, smoother skin by removing dead skin cells.",
    price: 110.00,
    durationMinutes: 45,
    imageUrl: "",
    categories: [{ id: 4, name: "Exfoliation" }]
  },
  {
    id: 6,
    name: "Microdermabrasion",
    description: "Mechanical exfoliation treatment that improves skin texture and tone.",
    price: 100.00,
    durationMinutes: 45,
    imageUrl: "",
    categories: [{ id: 4, name: "Exfoliation" }]
  }
];

const mockCategories = [
  { id: 1, name: "Facial Treatments", description: "Comprehensive facial care services" },
  { id: 2, name: "Anti-Aging", description: "Treatments to reduce signs of aging" },
  { id: 3, name: "Acne Care", description: "Solutions for acne-prone skin" },
  { id: 4, name: "Exfoliation", description: "Treatments to remove dead skin cells" },
];

const ServicesPage = () => {
  const [services] = useState(mockServices);
  const [categories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredServices = selectedCategory
    ? services.filter(service => 
        service.categories.some(category => category.id === selectedCategory)
      )
    : services;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover our range of professional treatments designed to address your specific skin concerns
              and help you achieve your skincare goals.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null 
              ? "bg-black hover:bg-gray-800 text-white rounded-none" 
              : "text-gray-800 border-gray-300 hover:bg-gray-50 rounded-none"
            }
          >
            All Services
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-black hover:bg-gray-800 text-white rounded-none" 
                : "text-gray-800 border-gray-300 hover:bg-gray-50 rounded-none"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div key={service.id} className="group">
              <div className="aspect-square bg-gray-100 mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition duration-300">
                  Service Image
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{service.name}</h3>
                <div className="text-right">
                  <span className="font-medium text-lg">${service.price.toFixed(2)}</span>
                  <p className="text-sm text-gray-500">{service.durationMinutes} min</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {service.categories.map(category => (
                    <span key={category.id} className="text-xs px-2 py-1 bg-gray-100 text-gray-600">
                      {category.name}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/book-service/${service.id}`} 
                  className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70"
                >
                  Book Now <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Not Sure Which Treatment Is Right For You?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Take our skin quiz to receive personalized treatment recommendations or book a consultation with our specialists.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-none px-8">
              <Link to="/quiz">Take Skin Quiz</Link>
            </Button>
            <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 rounded-none px-8">
              <Link to="/specialists">Speak With a Specialist</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
