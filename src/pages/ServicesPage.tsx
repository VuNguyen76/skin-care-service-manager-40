
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const [services, setServices] = useState(mockServices);
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredServices = selectedCategory
    ? services.filter(service => 
        service.categories.some(category => category.id === selectedCategory)
      )
    : services;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover our range of professional skincare treatments
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map(service => (
            <Card key={service.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  {service.durationMinutes} minutes | ${service.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.categories.map(category => (
                    <span key={category.id} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {category.name}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/book-service/${service.id}`} className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
