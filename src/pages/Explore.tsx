
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Stethoscope, Eye, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DoctorCard from "@/components/DoctorCard";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Doctors", icon: Users },
    { id: "cardiologist", name: "Cardiologist", icon: Heart },
    { id: "surgeon", name: "Surgeon", icon: Activity },
    { id: "psychiatrist", name: "Psychiatrist", icon: Brain },
    { id: "ent", name: "ENT Specialist", icon: Stethoscope },
    { id: "ophthalmologist", name: "Ophthalmologist", icon: Eye }
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      category: "cardiologist",
      experience: "15 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1594824804732-ca0916aa2cbc?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Today, 2:00 PM",
      consultationFee: "₹800"
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialization: "Surgeon",
      category: "surgeon",
      experience: "20 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Tomorrow, 10:00 AM",
      consultationFee: "₹1200"
    },
    {
      id: 3,
      name: "Dr. Anita Gupta",
      specialization: "Psychiatrist",
      category: "psychiatrist",
      experience: "12 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Today, 4:00 PM",
      consultationFee: "₹900"
    },
    {
      id: 4,
      name: "Dr. Arjun Singh",
      specialization: "ENT Specialist",
      category: "ent",
      experience: "18 years",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Monday, 9:00 AM",
      consultationFee: "₹700"
    },
    {
      id: 5,
      name: "Dr. Kavita Patel",
      specialization: "Ophthalmologist",
      category: "ophthalmologist",
      experience: "14 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Tomorrow, 2:30 PM",
      consultationFee: "₹750"
    },
    {
      id: 6,
      name: "Dr. Vikram Mehta",
      specialization: "Cardiologist",
      category: "cardiologist",
      experience: "22 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
      nextAvailable: "Today, 6:00 PM",
      consultationFee: "₹1000"
    }
  ];

  const filteredDoctors = selectedCategory === "all" 
    ? doctors 
    : doctors.filter(doctor => doctor.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Your Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our network of qualified healthcare professionals and book your appointment today.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Specializations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <category.icon className={`h-8 w-8 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Available Doctors ({filteredDoctors.length})
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found in this category. Please try a different specialization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
