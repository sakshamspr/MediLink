
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
  const [apiKey] = useState("aa0083d6a89a4a5ab0f7b5565779522d");
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && apiKey) {
      fetchNearbyHospitals(apiKey);
    }
  }, [userLocation, apiKey]);

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
        type: feature.properties.categories?.[0]?.replace('healthcare.', '').replace('_', ' ') || "Hospital"
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

    // Create a modern map container
    const mapContainer = document.createElement('div');
    mapContainer.className = 'w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl relative overflow-hidden shadow-lg border border-gray-200';

    // Create static map image with better styling
    const mapImg = document.createElement('img');
    const markers = hospitalData.slice(0, 10).map(hospital => 
      `lonlat:${hospital.coordinates.lng},${hospital.coordinates.lat};color:%23dc2626;size:medium;type:material;icon:hospital;icontype:material`
    ).join('|');
    
    const userMarker = `lonlat:${userLocation.lng},${userLocation.lat};color:%232563eb;size:large;type:material;icon:person;icontype:material`;
    const allMarkers = `${userMarker}|${markers}`;

    mapImg.src = `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&width=800&height=400&center=lonlat:${userLocation.lng},${userLocation.lat}&zoom=13&marker=${allMarkers}&apiKey=${apiKey}`;
    mapImg.className = 'w-full h-full object-cover transition-opacity duration-300';
    mapImg.alt = 'Hospital locations map';
    
    // Add loading state
    mapImg.onload = () => {
      mapImg.style.opacity = '1';
    };
    mapImg.style.opacity = '0';

    mapContainer.appendChild(mapImg);

    // Add modern legend with better styling
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 text-sm';
    legend.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-4 h-4 bg-blue-600 rounded-full shadow-sm"></div>
        <span class="text-gray-700 font-medium">Your Location</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
        <span class="text-gray-700 font-medium">Hospitals</span>
      </div>
    `;
    mapContainer.appendChild(legend);

    // Add distance info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 text-sm';
    infoOverlay.innerHTML = `
      <div class="text-gray-600 font-medium">Search Radius</div>
      <div class="text-blue-600 font-bold">5 km</div>
    `;
    mapContainer.appendChild(infoOverlay);

    mapRef.current.appendChild(mapContainer);
  };

  return (
    <div className="w-full">
      <div ref={mapRef} />
      {showApiInput && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Geoapify API key"
              onKeyPress={(e) => e.key === 'Enter' && setShowApiInput(false)}
            />
            <Button onClick={() => setShowApiInput(false)}>
              Update Key
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalMap;
