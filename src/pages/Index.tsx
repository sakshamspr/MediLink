
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Expert Care",
      description: "Connect with qualified doctors across multiple specializations"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: Clock,
      title: "Easy Scheduling",
      description: "Book appointments instantly with real-time availability"
    },
    {
      icon: Users,
      title: "Personalized Experience",
      description: "Get recommendations based on your health needs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">MediLink</span>
          </div>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            Sign In with Google
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Your Health, Our{" "}
            <span className="text-blue-600">Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book appointments with trusted doctors, manage your health records, and get the care you deserve - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Find a Doctor
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-3 text-lg border-blue-200 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose MediLink?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make healthcare accessible, convenient, and trustworthy for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of patients who trust MediLink for their healthcare needs.
          </p>
          <Link to="/explore">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">MediLink</span>
          </div>
          <p className="text-gray-600">
            © 2024 MediLink. Making healthcare accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
