
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Hospital } from "@/pages/Hospitals";

interface HospitalMapProps {
  userLocation: { lat: number; lng: number };
  hospitals: Hospital[];
  searchRadius: number;
  onHospitalsFound: (hospitals: Hospital[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const HospitalMap = ({ userLocation, hospitals, searchRadius, onHospitalsFound, onLoadingChange }: HospitalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey] = useState("aa0083d6a89a4a5ab0f7b5565779522d");
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && apiKey && searchRadius) {
      fetchNearbyHospitals(apiKey);
    }
  }, [userLocation, apiKey, searchRadius]);

  const fetchNearbyHospitals = async (apiKey: string) => {
    if (!apiKey || !userLocation || !searchRadius) return;

    onLoadingChange(true);
    
    try {
      // Fix the API call to properly include the search radius
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${userLocation.lng},${userLocation.lat},${searchRadius}&bias=proximity:${userLocation.lng},${userLocation.lat}&limit=20&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.features) {
        throw new Error('Invalid response format from API');
      }
      
      const hospitalData: Hospital[] = data.features.map((feature: any, index: number) => ({
        id: feature.properties.place_id || `hospital-${index}`,
        name: feature.properties.name || "Unnamed Hospital",
        address: feature.properties.formatted || "Address not available",
        coordinates: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        },
        distance: feature.properties.distance,
        type: feature.properties.categories?.[0]?.replace('healthcare.', '').replace('_', ' ') || "Hospital"
      }));

      onHospitalsFound(hospitalData);
      initializeMap(apiKey, hospitalData);
      
      toast({
        title: "Hospitals found",
        description: `Found ${hospitalData.length} hospitals within ${(searchRadius / 1000).toFixed(1)} km.`,
      });
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: `Failed to fetch nearby hospitals: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      onHospitalsFound([]);
    } finally {
      onLoadingChange(false);
    }
  };

  const initializeMap = (apiKey: string, hospitalData: Hospital[]) => {
    if (!mapRef.current) return;

    // Clear existing map content
    mapRef.current.innerHTML = "";

    // Create a modern map container with enhanced styling
    const mapContainer = document.createElement('div');
    mapContainer.className = 'w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl relative overflow-hidden shadow-xl border border-gray-200';

    // Create static map image with better styling and proper zoom level based on radius
    const mapImg = document.createElement('img');
    
    // Calculate appropriate zoom level based on search radius
    const getZoomLevel = (radiusInMeters: number) => {
      if (radiusInMeters <= 1000) return 15;
      if (radiusInMeters <= 2000) return 14;
      if (radiusInMeters <= 5000) return 13;
      if (radiusInMeters <= 10000) return 12;
      if (radiusInMeters <= 15000) return 11;
      return 10;
    };
    
    const zoomLevel = getZoomLevel(searchRadius);
    
    const markers = hospitalData.slice(0, 15).map(hospital => 
      `lonlat:${hospital.coordinates.lng},${hospital.coordinates.lat};color:%23dc2626;size:medium;type:material;icon:hospital;icontype:material`
    ).join('|');
    
    const userMarker = `lonlat:${userLocation.lng},${userLocation.lat};color:%232563eb;size:large;type:material;icon:person;icontype:material`;
    const allMarkers = markers ? `${userMarker}|${markers}` : userMarker;

    mapImg.src = `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&width=900&height=500&center=lonlat:${userLocation.lng},${userLocation.lat}&zoom=${zoomLevel}&marker=${allMarkers}&apiKey=${apiKey}`;
    mapImg.className = 'w-full h-full object-cover transition-opacity duration-300';
    mapImg.alt = 'Hospital locations map';
    
    // Add loading state
    mapImg.onload = () => {
      mapImg.style.opacity = '1';
    };
    mapImg.onerror = () => {
      console.error('Failed to load map image');
      mapContainer.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
          <div class="text-center">
            <p class="mb-2">Map failed to load</p>
            <p class="text-sm">Please check your internet connection</p>
          </div>
        </div>
      `;
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
        <span class="text-gray-700 font-medium">Hospitals (${hospitalData.length})</span>
      </div>
    `;
    mapContainer.appendChild(legend);

    // Add search radius info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 text-sm';
    const radiusKm = (searchRadius / 1000).toFixed(1);
    infoOverlay.innerHTML = `
      <div class="text-gray-600 font-medium">Search Radius</div>
      <div class="text-blue-600 font-bold text-lg">${radiusKm} km</div>
      <div class="text-xs text-gray-500 mt-1">Zoom: ${zoomLevel}</div>
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
