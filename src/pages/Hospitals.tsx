
import { useState, useEffect } from "react";
import { Hospital, LocateIcon, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import HospitalMap from "@/components/HospitalMap";
import HospitalList from "@/components/HospitalList";
import { useToast } from "@/hooks/use-toast";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance?: number;
  rating?: number;
  phone?: string;
  type?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const Hospitals = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast } = useToast();

  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationLoading(false);
        toast({
          title: "Location detected",
          description: "Your location has been detected successfully.",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enable location services.",
          variant: "destructive",
        });
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Nearby Hospitals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover hospitals and medical facilities in your area with our interactive map and comprehensive directory.
          </p>
        </div>

        {/* Location Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <LocateIcon className="h-4 w-4 text-blue-600" />
              </div>
              Location Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!userLocation ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LocateIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Location Services</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We need access to your location to find the nearest hospitals and provide accurate directions.
                </p>
                <Button 
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
                  size="lg"
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <LocateIcon className="h-4 w-4 mr-2" />
                      Get My Location
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-800 font-semibold">Location detected successfully</span>
                </div>
                <p className="text-sm text-green-700">
                  Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map and Results */}
        {userLocation && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Map className="h-4 w-4 text-indigo-600" />
                    </div>
                    Interactive Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <HospitalMap 
                    userLocation={userLocation}
                    hospitals={hospitals}
                    onHospitalsFound={setHospitals}
                    onLoadingChange={setLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Hospital className="h-4 w-4 text-red-600" />
                      </div>
                      <span>Nearby Hospitals</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                      {hospitals.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HospitalList hospitals={hospitals} loading={loading} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
