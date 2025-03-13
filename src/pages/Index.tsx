
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
                  Discover Your <span className="font-medium">Perfect</span> Skin Journey
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Professional skincare treatments and personalized recommendations 
                  tailored to your unique skin needs.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white rounded-none px-8">
                    <Link to="/services">Explore Services</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-black text-black hover:bg-gray-100 rounded-none px-8">
                    <Link to="/quiz" className="flex items-center">
                      Take Skin Quiz <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden">
                  {/* This would be an image in production */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Featured Image
                  </div>
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
            <h2 className="text-3xl font-light mb-4">Featured Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our professional treatments are designed to address your specific skin concerns and help you achieve your skincare goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-all duration-300">
                  Service Image
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Classic Facial</h3>
              <p className="text-gray-600 mb-4">Deep cleansing treatment to purify and refresh your skin.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Learn More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Service 2 */}
            <div className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-all duration-300">
                  Service Image
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Anti-Aging Treatment</h3>
              <p className="text-gray-600 mb-4">Advanced treatment to minimize fine lines and restore skin elasticity.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Learn More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Service 3 */}
            <div className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-all duration-300">
                  Service Image
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Chemical Peel</h3>
              <p className="text-gray-600 mb-4">Exfoliating treatment for brighter, smoother skin texture.</p>
              <Link to="/services" className="text-black font-medium inline-flex items-center border-b border-black pb-1 hover:opacity-70">
                Learn More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 rounded-none px-8">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Consultation Image
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-light">Virtual Skin Consultation</h2>
              <p className="text-gray-600">
                Not sure which treatment is right for you? Take our personalized skin quiz or book a virtual consultation with our specialists.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-none">
                  <Link to="/quiz">Take Skin Quiz</Link>
                </Button>
                <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 rounded-none">
                  <Link to="/specialists">Meet Our Specialists</Link>
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
