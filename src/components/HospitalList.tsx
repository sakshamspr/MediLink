
import { hospital } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Hospital } from "@/pages/Hospitals";

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
}

const HospitalList = ({ hospitals, loading }: HospitalListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="text-center py-8">
        <hospital className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hospitals found nearby.</p>
        <p className="text-sm text-gray-400 mt-2">
          Try expanding your search radius or check your location.
        </p>
      </div>
    );
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {hospitals.map((hospital) => (
        <Card key={hospital.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {hospital.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {hospital.address}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {hospital.distance && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {formatDistance(hospital.distance)}
                    </span>
                  )}
                  {hospital.type && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {hospital.type}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <hospital className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {hospital.phone && (
              <div className="mt-3 pt-3 border-t">
                <a 
                  href={`tel:${hospital.phone}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {hospital.phone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
