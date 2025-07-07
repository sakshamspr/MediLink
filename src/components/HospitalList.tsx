
import { Hospital } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hospital as HospitalType } from "@/pages/Hospitals";

interface HospitalListProps {
  hospitals: HospitalType[];
  loading: boolean;
}

const HospitalList = ({ hospitals, loading }: HospitalListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-200 h-12 w-12 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-gray-200 h-5 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                    <div className="flex gap-2">
                      <div className="bg-gray-200 h-6 rounded w-16"></div>
                      <div className="bg-gray-200 h-6 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Hospital className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hospitals found</h3>
        <p className="text-gray-500 mb-1">We couldn't find any hospitals in your area.</p>
        <p className="text-sm text-gray-400">
          Try expanding your search radius or check your location settings.
        </p>
      </div>
    );
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatType = (type?: string) => {
    if (!type) return 'Hospital';
    return type.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Hospital';
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {hospitals.map((hospital, index) => (
        <Card key={hospital.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {hospital.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    #{index + 1}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {hospital.address}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {hospital.distance && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                      📍 {formatDistance(hospital.distance)}
                    </Badge>
                  )}
                  {hospital.type && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                      🏥 {formatType(hospital.type)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
