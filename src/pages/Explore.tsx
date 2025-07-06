
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Activity, Brain, Stethoscope, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import DoctorCard from "@/components/DoctorCard";
import { useDoctors, useCategories } from "@/hooks/useDoctors";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: categories = [] } = useCategories();
  const { data: doctors = [], isLoading } = useDoctors(selectedCategory === "all" ? undefined : selectedCategory);

  const iconMap = {
    Heart,
    Activity,
    Brain,
    Stethoscope,
    Eye,
    Users
  };

  const categoriesWithAll = [
    { id: "all", name: "All Doctors", icon: "Users" },
    ...categories.map(cat => ({ ...cat, icon: cat.icon }))
  ];

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
            {categoriesWithAll.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
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
                    <IconComponent className={`h-8 w-8 mx-auto mb-2 ${
                      selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <p className={`text-sm font-medium ${
                      selectedCategory === category.id ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Available Doctors ({doctors.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading doctors...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>

        {!isLoading && doctors.length === 0 && (
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
