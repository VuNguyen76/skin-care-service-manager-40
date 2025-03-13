
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import TestLoginPanel from "@/components/TestLoginPanel";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Skincare Specialist</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your one-stop destination for all your skincare needs and expert consultations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/services">Explore Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/specialists">Meet Our Specialists</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/quiz">Take Skin Quiz</Link>
              </Button>
            </div>
          </div>
          
          <div className="my-12 p-4 border border-dashed border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Testing Panel (Development Only)</h2>
            <TestLoginPanel />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
