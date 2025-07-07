
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
          title: "Location found",
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Hospital className="h-10 w-10 text-blue-600" />
            Find Nearby Hospitals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Locate hospitals and medical facilities near you with our interactive map and comprehensive directory.
          </p>
        </div>

        {/* Location Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LocateIcon className="h-5 w-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!userLocation ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  We need your location to find nearby hospitals.
                </p>
                <Button 
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {locationLoading ? "Getting Location..." : "Get My Location"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-green-600 font-medium">
                  ✓ Location detected successfully
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map and Results */}
        {userLocation && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Hospital Map
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
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Hospitals ({hospitals.length})</CardTitle>
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
