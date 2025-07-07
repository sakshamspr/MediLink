
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Hospital } from "@/pages/Hospitals";

interface HospitalMapProps {
  userLocation: { lat: number; lng: number };
  hospitals: Hospital[];
  onHospitalsFound: (hospitals: Hospital[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const HospitalMap = ({ userLocation, hospitals, onHospitalsFound, onLoadingChange }: HospitalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);
  const { toast } = useToast();

  const fetchNearbyHospitals = async (apiKey: string) => {
    if (!apiKey || !userLocation) return;

    onLoadingChange(true);
    
    try {
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${userLocation.lng},${userLocation.lat},5000&bias=proximity:${userLocation.lng},${userLocation.lat}&limit=20&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const data = await response.json();
      
      const hospitalData: Hospital[] = data.features.map((feature: any, index: number) => ({
        id: feature.properties.place_id || `hospital-${index}`,
        name: feature.properties.name || "Unnamed Hospital",
        address: feature.properties.formatted || "Address not available",
        coordinates: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        },
        distance: feature.properties.distance,
        phone: feature.properties.contact?.phone,
        type: feature.properties.categories?.[0] || "Hospital"
      }));

      onHospitalsFound(hospitalData);
      initializeMap(apiKey, hospitalData);
      
      toast({
        title: "Hospitals found",
        description: `Found ${hospitalData.length} hospitals nearby.`,
      });
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby hospitals. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      onLoadingChange(false);
    }
  };

  const initializeMap = (apiKey: string, hospitalData: Hospital[]) => {
    if (!mapRef.current) return;

    // Clear existing map content
    mapRef.current.innerHTML = "";

    // Create a simple interactive map using Geoapify Static Maps
    const mapContainer = document.createElement('div');
    mapContainer.className = 'w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden';

    // Create static map image
    const mapImg = document.createElement('img');
    const markers = hospitalData.slice(0, 10).map(hospital => 
      `lonlat:${hospital.coordinates.lng},${hospital.coordinates.lat};color:%23ff0000;size:medium`
    ).join('|');
    
    const userMarker = `lonlat:${userLocation.lng},${userLocation.lat};color:%230000ff;size:large`;
    const allMarkers = `${userMarker}|${markers}`;

    mapImg.src = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${userLocation.lng},${userLocation.lat}&zoom=13&marker=${allMarkers}&apiKey=${apiKey}`;
    mapImg.className = 'w-full h-full object-cover';
    mapImg.alt = 'Hospital locations map';

    mapContainer.appendChild(mapImg);

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm';
    legend.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span>Your Location</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>Hospitals</span>
      </div>
    `;
    mapContainer.appendChild(legend);

    mapRef.current.appendChild(mapContainer);
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Geoapify API key.",
        variant: "destructive",
      });
      return;
    }
    
    setShowApiInput(false);
    fetchNearbyHospitals(apiKey);
  };

  if (showApiInput) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Enter Geoapify API Key</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get your free API key from{" "}
          <a 
            href="https://www.geoapify.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            geoapify.com
          </a>
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            type="password"
            placeholder="Enter your Geoapify API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
          />
          <Button onClick={handleApiKeySubmit}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={mapRef} />
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowApiInput(true)}
        >
          Change API Key
        </Button>
      </div>
    </div>
  );
};

export default HospitalMap;
