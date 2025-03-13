
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-100 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Your Skin Deserves the Best Care
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Professional skincare treatments tailored to your unique needs.
              Book your consultation today.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/quiz">
                <Button size="lg" className="rounded-md shadow">
                  Take Skin Quiz
                </Button>
              </Link>
              <Link to="/services" className="ml-3">
                <Button size="lg" variant="outline" className="rounded-md">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Popular Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover our most sought-after treatments.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* These would be populated from API data */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 bg-gray-200"></div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Facial Treatment {item}</h3>
                  <p className="mt-2 text-gray-500">
                    A relaxing facial that deeply cleanses and nourishes your skin.
                  </p>
                  <div className="mt-4">
                    <Link to={`/services/${item}`}>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="link">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Specialists */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Meet Our Specialists
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Expert skincare professionals dedicated to your wellness.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* These would be populated from API data */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-300"></div>
                </div>
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Dr. Specialist {item}</h3>
                  <p className="text-sm text-purple-600">Skin Care Expert</p>
                  <p className="mt-2 text-gray-500">
                    Over 5 years of experience in advanced skincare treatments.
                  </p>
                  <div className="mt-4">
                    <Link to={`/specialists/${item}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/specialists">
              <Button variant="link">View All Specialists</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Clients Say
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 shadow rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">C{item}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Client {item}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "The service was exceptional. My skin has never felt so refreshed
                  and rejuvenated. I highly recommend their treatments!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Transform Your Skin?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-purple-100">
              Book your appointment today and start your journey to beautiful skin.
            </p>
            <div className="mt-8">
              <Link to="/quiz">
                <Button size="lg" variant="secondary" className="rounded-md shadow">
                  Take Skin Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
