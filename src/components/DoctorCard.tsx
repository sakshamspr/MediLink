
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
  nextAvailable: string;
  consultationFee: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {doctor.name}
            </h3>
            <Badge variant="secondary" className="mb-2">
              {doctor.specialization}
            </Badge>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
              <span className="text-gray-500 text-sm ml-1">• {doctor.experience}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {doctor.nextAvailable}
            </div>
            <div className="flex items-center font-semibold text-green-600">
              <DollarSign className="h-4 w-4 mr-1" />
              {doctor.consultationFee}
            </div>
          </div>
          
          <Link to={`/doctor/${doctor.id}`} className="block">
            <Button className="w-full mt-3">
              View Profile & Book
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
